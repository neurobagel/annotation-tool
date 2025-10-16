import { createFilterOptions, FilterOptionsState } from '@mui/material';
import axios from 'axios';
import Papa from 'papaparse';
import assessmentTerms from '../assets/default_config/assessment.json';
import defaultConfigData from '../assets/default_config/config.json';
import diagnosisTerms from '../assets/default_config/diagnosis.json';
import sexTerms from '../assets/default_config/sex.json';
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
} from './internal_types';

// Utility functions for store

export function parseTsvContent(content: string): { headers: string[]; data: string[][] } {
  if (!content) return { headers: [], data: [] };

  // TODO: simply skipping empty rows here may cause downstream problems,
  // see: https://github.com/neurobagel/annotation-tool/issues/142
  const result = Papa.parse<string[]>(content, {
    delimiter: '\t',
    skipEmptyLines: true,
  });

  const rows = (result.data || []) as string[][];
  const headers = rows[0];
  const data = rows.slice(1);

  return { headers, data };
}

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
  } catch (error) {
    // TODO: show a notif error
    // Fallback to default config when remote fetching fails
    try {
      const config = (defaultConfigData as ConfigFile[])[0];
      const termsData: Record<string, VocabConfig[]> = {
        'assessment.json': assessmentTerms as VocabConfig[],
        'diagnosis.json': diagnosisTerms as VocabConfig[],
        'sex.json': sexTerms as VocabConfig[],
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

/**
 * Creates a custom autocomplete sorter function for MUI Autocomplete components.
 *
 * This function wraps MUI's default filtering and adds custom sorting to prioritize
 * results by relevance:
 * 1. Exact matches first
 * 2. Starts with input (shortest to longest)
 * 3. Contains input (shortest to longest)
 * 4. Other matches (shortest to longest)
 *
 * Note: The actual filtering (which options match) is handled by MUI's createFilterOptions.
 * This function only sorts the already-filtered results for better UX.
 */
export function createAutocompleteSorter<T>(
  stringify: (option: T) => string
): (options: T[], state: FilterOptionsState<T>) => T[] {
  const baseFilter = createFilterOptions({ stringify });

  return (options: T[], state: FilterOptionsState<T>) => {
    // First, let MUI's default filter handle the actual filtering
    const filtered = baseFilter(options, state);
    const inputValue = state.inputValue.toLowerCase().trim();

    // If no input, return filtered results in original order
    if (!inputValue) return filtered;

    // Sort the filtered results by relevance
    return filtered.sort((a, b) => {
      const aText = stringify(a).toLowerCase();
      const bText = stringify(b).toLowerCase();

      // Priority 1: Exact matches
      const aExact = aText === inputValue;
      const bExact = bText === inputValue;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      if (aExact && bExact) return aText.length - bText.length;

      // Priority 2: Starts with input (shorter options first)
      const aStarts = aText.startsWith(inputValue);
      const bStarts = bText.startsWith(inputValue);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      if (aStarts && bStarts) return aText.length - bText.length;

      // Priority 3: Contains input (shorter options first)
      const aContains = aText.includes(inputValue);
      const bContains = bText.includes(inputValue);
      if (aContains && !bContains) return -1;
      if (!aContains && bContains) return 1;
      if (aContains && bContains) return aText.length - bText.length;

      // Priority 4: Other matches (shorter options first)
      return aText.length - bText.length;
    });
  };
}

export function getDataDictionary(columns: Columns): DataDictionary {
  return Object.entries(columns).reduce<DataDictionary>((dictAcc, [_columnKey, column]) => {
    if (column.header) {
      const dictionaryEntry: DataDictionary[string] = {
        Description: column.description || '',
      };

      // Description of levels always included for the BIDS section
      if (column.variableType === 'Categorical' && column.levels) {
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

      if (column.variableType === 'Continuous' && column.units !== undefined) {
        dictionaryEntry.Units = column.units;
      }

      if (column.standardizedVariable) {
        dictionaryEntry.Annotations = {
          IsAbout: {
            TermURL: column.standardizedVariable.identifier,
            Label: column.standardizedVariable.label,
          },
          VariableType: column.variableType,
        };

        // Add term url to Levels under BIDS section only for a categorical column with a standardized variable
        if (column.variableType === 'Categorical' && column.levels) {
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
            (termsObj, [levelKey, levelValue]) => {
              if (levelValue.termURL && levelValue.label) {
                // Include properly mapped levels
                return {
                  ...termsObj,
                  [levelKey]: {
                    TermURL: levelValue.termURL,
                    Label: levelValue.label,
                  },
                };
              }
              // Replace the incomplete levels annotation with an empty object
              // to avoid a data dictionary with undefined values and to raise a
              // warning to the user based on the schema validation
              return {
                ...termsObj,
                [levelKey]: {} as { TermURL: string; Label: string },
              };
            },
            {} as { [key: string]: { TermURL: string; Label: string } }
          );
        }

        if (column.isPartOf?.termURL && column.isPartOf?.label) {
          dictionaryEntry.Annotations.IsPartOf = {
            TermURL: column.isPartOf.termURL,
            Label: column.isPartOf.label,
          };
        }

        if (column.missingValues && column.variableType !== null) {
          dictionaryEntry.Annotations.MissingValues = column.missingValues;
        }

        if (column.variableType === 'Continuous' && column.format) {
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
