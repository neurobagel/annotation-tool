import axios from 'axios';
import assessmentTerms from '../assets/default_config/assessment.json';
import defaultConfigData from '../assets/default_config/config.json';
import diagnosisTerms from '../assets/default_config/diagnosis.json';
import sexTerms from '../assets/default_config/sex.json';
import subjectgroupTerms from '../assets/default_config/subjectgroup.json';
import { fetchConfigGitHubURL, githubRawBaseURL } from './constants';
import {
  ConfigFile,
  VocabConfig,
  TermsFileStandardizedTerm,
  ConfigFileTermFormat,
  ConfigFileStandardizedVariable,
} from './external_types';
import {
  Config,
  Columns,
  MultiColumnMeasuresTermCard,
  StandardizedTerm,
  TermFormat,
  DataDictionary,
  VariableType,
  BIDSType,
} from './internal_types';

// Utility functions for store

export async function fetchAvailableConfigs(): Promise<string[]> {
  try {
    const response = await axios.get(fetchConfigGitHubURL);
    const data = response.data as { type: string; name: string }[];
    const dirs = data.filter((item) => item.type === 'dir');
    return dirs.map((dir) => dir.name).sort();
  } catch (error) {
    // TODO: show a notif error
    // Return a default config option when remote fetching fails
    return ['Neurobagel'];
  }
}

// Helper function to load config from a given path
async function loadConfigFromPath(
  configPath: string
): Promise<{ config: ConfigFile; termsData: Record<string, VocabConfig[]> }> {
  const configResponse = await axios.get(configPath);
  const configArray = configResponse.data;
  const config = configArray[0];

  // Find all unique terms_file values in standardized_variables
  const termFiles = new Set<string>();
  const variables = config.standardized_variables;

  variables.forEach((variable: ConfigFileStandardizedVariable) => {
    if (variable.terms_file) {
      termFiles.add(variable.terms_file);
    }
  });

  // Load all term files
  const termsData: Record<string, VocabConfig[]> = {};
  const baseUrl = configPath.replace('/config.json', '');

  await Promise.all(
    Array.from(termFiles).map(async (file) => {
      try {
        const res = await axios.get(`${baseUrl}/${file}`);
        termsData[file] = res.data;
      } catch (e) {
        // TODO: show notif error for remote
        termsData[file] = [];
      }
    })
  );

  return { config, termsData };
}

export async function fetchConfig(
  selectedConfig: string
): Promise<{ config: ConfigFile; termsData: Record<string, VocabConfig[]> }> {
  try {
    return await loadConfigFromPath(`${githubRawBaseURL}${selectedConfig}/config.json`);
    // TODO : remove this testing / dev mock and use the real fetch
    // throw new Error(
    //   `Simulated fetch error for ${selectedConfig} and ${githubRawBaseURL}${selectedConfig}/config.json`
    // );
  } catch (error) {
    // TODO: show a notif error
    // Fallback to default config when remote fetching fails
    try {
      const config = (defaultConfigData as ConfigFile[])[0];
      const termsData: Record<string, VocabConfig[]> = {
        'assessment.json': assessmentTerms as VocabConfig[],
        'diagnosis.json': diagnosisTerms as VocabConfig[],
        'sex.json': sexTerms as VocabConfig[],
        'subjectgroup.json': subjectgroupTerms as VocabConfig[],
      };
      return { config, termsData };
    } catch (fallbackError) {
      return { config: {} as ConfigFile, termsData: {} };
    }
  }
}

export function mapConfigFileToStoreConfig(
  configFile: ConfigFile,
  termsData: Record<string, VocabConfig[]>
): Config {
  const namespacePrefix = configFile.namespace_prefix;

  const config: Config = {};

  // Loop through each standardized variable in the config file
  configFile.standardized_variables.forEach((variable: ConfigFileStandardizedVariable) => {
    const identifier = `${namespacePrefix}:${variable.id}`;
    const label = variable.name;

    // Copy all other fields except id, name, termsFile, formats
    const { id, name, terms_file: termsFile, formats: rawFormats, ...rest } = variable;

    // Map terms from all vocabularies in the terms file (if present)
    let terms: StandardizedTerm[] | undefined;
    if (termsFile && termsData[termsFile]) {
      const vocabsArr = termsData[termsFile];
      const allTerms: StandardizedTerm[] = [];
      vocabsArr.forEach((vocab: VocabConfig) => {
        const termsNamespace = vocab.namespace_prefix;
        if (Array.isArray(vocab.terms)) {
          (vocab.terms as TermsFileStandardizedTerm[]).forEach((term) => {
            const { id: termId, name: termName, ...restTermFields } = term;
            allTerms.push({
              identifier: `${termsNamespace}:${termId}`,
              label: termName,
              ...restTermFields,
            });
          });
        }
      });
      terms = allTerms;
    }

    // Map formats from config file to in-app format (if present)
    let formats: TermFormat[] | undefined;
    if (rawFormats) {
      formats = (rawFormats as ConfigFileTermFormat[]).map((format) => {
        const { id: formatId, name: formatName, ...restFormatFields } = format;
        return {
          termURL: `${namespacePrefix}:${formatId}`,
          label: formatName,
          ...restFormatFields,
        };
      });
    }

    config[identifier] = {
      identifier,
      label,
      ...rest,
      ...(terms ? { terms } : {}),
      ...(formats ? { formats } : {}),
    };
  });

  return config;
}

// TODO: revisit this function. For now it is here because of type safety
// If there is a way for us to encode this mapping in an Object and still
// make typescript happy, then we should do that.
export function mapVariableTypeToBIDSType(variableType: VariableType): BIDSType {
  switch (variableType) {
    case 'Continuous':
      return 'Continuous';
    case 'Categorical':
      return 'Categorical';
    case 'Collection':
      return null;
    case 'Identifier':
      return null;
    default:
      return null;
  }
}

// Utility functions for MultiColumnMeasures component

export const getAllMappedColumns = (termCards: MultiColumnMeasuresTermCard[]) =>
  termCards.flatMap((card) => card.mappedColumns);

export function getColumnsAssignedText(mappedColumnsCount: number): string {
  if (mappedColumnsCount === 0) return 'No columns assigned';
  if (mappedColumnsCount === 1) return '1 column assigned';
  return `${mappedColumnsCount} columns assigned`;
}

export function createMappedColumnHeaders(
  mappedColumns: string[],
  columns: Columns
): Record<string, string> {
  return Object.fromEntries(mappedColumns.map((id) => [id, columns[id]?.header || `Column ${id}`]));
}

export function getDataDictionary(columns: Columns): DataDictionary {
  return Object.entries(columns).reduce<DataDictionary>((dictAcc, [_columnKey, column]) => {
    if (column.header) {
      const dictionaryEntry: DataDictionary[string] = {
        Description: column.description || '',
      };

      // Description of levels always included for the BIDS section
      if (column.bidsType === 'Categorical' && column.levels) {
        dictionaryEntry.Levels = Object.entries(column.levels).reduce(
          (levelsObj, [levelKey, levelValue]) => ({
            ...levelsObj,
            [levelKey]: {
              Description: levelValue.description || '',
            },
          }),
          {} as { [key: string]: { Description: string } }
        );
      }

      if (column.bidsType === 'Continuous' && column.units !== undefined) {
        dictionaryEntry.Units = column.units;
      }

      if (column.standardizedVariable) {
        dictionaryEntry.Annotations = {
          IsAbout: {
            TermURL: column.standardizedVariable.identifier,
            Label: column.standardizedVariable.label,
          },
          VariableType: column.mappedVariableType || null,
        };

        // Add term url to Levels under BIDS section only for a categorical column with a standardized variable
        if (column.bidsType === 'Categorical' && column.levels) {
          dictionaryEntry.Levels = Object.entries(column.levels).reduce(
            (updatedLevels, [levelKey, levelValue]) => ({
              ...updatedLevels,
              [levelKey]: {
                ...updatedLevels[levelKey],
                ...(levelValue.termURL ? { TermURL: levelValue.termURL } : {}),
              },
            }),
            dictionaryEntry.Levels || {}
          );

          dictionaryEntry.Annotations.Levels = Object.entries(column.levels).reduce(
            (termsObj, [levelKey, levelValue]) => ({
              ...termsObj,
              [levelKey]: {
                TermURL: levelValue.termURL || '',
                Label: levelValue.label || '',
              },
            }),
            {} as { [key: string]: { TermURL: string; Label: string } }
          );
        }

        if (column.isPartOf?.termURL && column.isPartOf?.label) {
          dictionaryEntry.Annotations.IsPartOf = {
            TermURL: column.isPartOf.termURL,
            Label: column.isPartOf.label,
          };
        }

        if (column.missingValues && column.bidsType !== null) {
          dictionaryEntry.Annotations.MissingValues = column.missingValues;
        }

        if (column.bidsType === 'Continuous' && column.format) {
          dictionaryEntry.Annotations.Format = {
            TermURL: column.format?.termURL || '',
            Label: column.format?.label || '',
          };
        }
      }

      return {
        ...dictAcc,
        [column.header]: dictionaryEntry,
      };
    }
    return dictAcc;
  }, {} as DataDictionary);
}
