import axios from 'axios';
import Papa from 'papaparse';
import {
  StandardizedVariables,
  StandardizedTerms,
  StandardizedFormats,
  DataDictionary,
  Columns,
  VariableType,
  DataType,
} from '../../datamodel';
import assessmentTerms from '../assets/default_config/assessment.json';
import defaultConfigData from '../assets/default_config/config.json';
import diagnosisTerms from '../assets/default_config/diagnosis.json';
import sexTerms from '../assets/default_config/sex.json';
import { fetchConfigGitHubURL, githubRawBaseURL } from './constants';
import {
  FreshConfigFile,
  VocabConfig,
  FreshConfigFileStandardizedVariable,
} from './external_types';

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
): Promise<{ config: FreshConfigFile; termsData: Record<string, VocabConfig[]> }> {
  const configResponse = await axios.get(configPath);
  const configArray = configResponse.data;
  const config = configArray[0];

  // Find all unique terms_file values in standardized_variables
  const termFiles = new Set<string>();
  const variables = config.standardized_variables;

  variables.forEach((variable: FreshConfigFileStandardizedVariable) => {
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
): Promise<{ config: FreshConfigFile; termsData: Record<string, VocabConfig[]> }> {
  try {
    return await loadConfigFromPath(`${githubRawBaseURL}${selectedConfig}/config.json`);
  } catch (error) {
    // TODO: show a notif error
    // Fallback to default config when remote fetching fails
    try {
      const config = (defaultConfigData as FreshConfigFile[])[0];
      const termsData: Record<string, VocabConfig[]> = {
        'assessment.json': assessmentTerms as VocabConfig[],
        'diagnosis.json': diagnosisTerms as VocabConfig[],
        'sex.json': sexTerms as VocabConfig[],
      };
      return { config, termsData };
    } catch (fallbackError) {
      return { config: {} as FreshConfigFile, termsData: {} };
    }
  }
}

export function convertStandardizedVariables(
  variables: FreshConfigFileStandardizedVariable[],
  namespacePrefix: string
): StandardizedVariables {
  return variables.reduce((acc, variable) => {
    const identifier = `${namespacePrefix}:${variable.id}`;
    const { id, name, terms_file: termsFile, formats: rawFormats, ...rest } = variable;
    return {
      ...acc,
      [identifier]: {
        id: identifier,
        name,
        ...rest,
      },
    };
  }, {} as StandardizedVariables);
}

export function convertStandardizedTerms(
  termsData: Record<string, VocabConfig[]>,
  variables: FreshConfigFileStandardizedVariable[],
  variableNamespacePrefix: string
): StandardizedTerms {
  return Object.entries(termsData).reduce((acc, [fileName, vocabsArray]) => {
    const newTerms = vocabsArray.flatMap((vocab) => {
      const termsNamespace = vocab.namespace_prefix;
      return vocab.terms.map((term) => {
        const termIdentifier = `${termsNamespace}:${term.id}`;
        const { id, name, ...restTermFields } = term;

        const parentVariable = variables.find((v) => v.terms_file === fileName);
        const standardizedVariableId = parentVariable
          ? `${variableNamespacePrefix}:${parentVariable.id}`
          : '';

        return {
          [termIdentifier]: {
            standardizedVariableId,
            id: termIdentifier,
            label: name,
            ...restTermFields,
            isCollection: false,
          },
        };
      });
    });

    return {
      ...acc,
      ...Object.assign({}, ...newTerms),
    };
  }, {} as StandardizedTerms);
}

export function convertStandardizedFormats(
  variables: FreshConfigFileStandardizedVariable[],
  namespacePrefix: string
): StandardizedFormats {
  return variables.reduce((acc, variable) => {
    if (!variable.formats) {
      return acc;
    }

    const standardizedVariableId = `${namespacePrefix}:${variable.id}`;
    const newFormats = variable.formats.map((format) => {
      const formatIdentifier = `${namespacePrefix}:${format.id}`;
      const { id, name, ...restFormatFields } = format;
      return {
        [formatIdentifier]: {
          standardizedVariableId,
          identifier: formatIdentifier,
          label: name,
          ...restFormatFields,
        },
      };
    });

    return {
      ...acc,
      ...Object.assign({}, ...newFormats),
    };
  }, {} as StandardizedFormats);
}

export async function readFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
}

export function parseTsvContent(content: string): { headers: string[]; data: string[][] } {
  if (!content) return { headers: [], data: [] };

  // TODO: consider validating the table against our schema first,
  // simply skipping empty rows here may cause downstream problems,
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

/**
 * Returns a copy of the column with data type dependent fields updated.
 * Safe to use with Immer since the original object remains untouched.
 */
interface ColumnDataShape {
  dataType?: DataType | null;
  levels?: { [key: string]: { description: string; standardizedTerm: string } } | null;
  units?: string;
}

export function applyDataTypeToColumn<T extends ColumnDataShape>(
  column: T,
  dataType: DataType | null,
  allValues: string[]
): T {
  const updatedColumn: T = {
    ...column,
    dataType,
  };

  if (dataType === DataType.categorical) {
    const uniqueValues = Array.from(new Set(allValues));

    if (!column.levels) {
      updatedColumn.levels = uniqueValues.reduce(
        (acc, value) => ({
          ...acc,
          [value]: { description: '', standardizedTerm: '' },
        }),
        {} as { [key: string]: { description: string; standardizedTerm: string } }
      );
    }

    delete updatedColumn.units;
  } else if (dataType === DataType.continuous) {
    if (updatedColumn.units === undefined) {
      updatedColumn.units = '';
    }
    delete updatedColumn.levels;
  } else {
    delete updatedColumn.levels;
    delete updatedColumn.units;
  }

  return updatedColumn;
}

export function applyDataDictionaryToColumns(
  columns: Columns,
  dataDictionary: DataDictionary,
  standardizedVariables: StandardizedVariables,
  standardizedTerms: StandardizedTerms,
  standardizedFormats: StandardizedFormats
): Columns {
  return Object.entries(dataDictionary).reduce((updatedColumns, [columnName, columnData]) => {
    const matchingColumnEntry = Object.entries(updatedColumns).find(
      ([_, column]) => column.name === columnName
    );

    if (!matchingColumnEntry) return updatedColumns;

    const [columnId] = matchingColumnEntry;
    const column = { ...updatedColumns[columnId] };

    if (columnData.Description) {
      column.description = columnData.Description;
    }

    if (columnData.Annotations?.MissingValues) {
      column.missingValues = columnData.Annotations.MissingValues;
    }

    let variableType: VariableType | undefined;
    if (columnData.Annotations?.IsAbout?.TermURL) {
      const standardizedVariableId = columnData.Annotations.IsAbout.TermURL;
      if (standardizedVariables[standardizedVariableId]) {
        column.standardizedVariable = standardizedVariableId;
        variableType = standardizedVariables[standardizedVariableId].variable_type;
      }
    }

    if (!variableType && columnData.Annotations?.VariableType) {
      variableType = columnData.Annotations.VariableType;
    }

    switch (variableType) {
      case VariableType.categorical:
        column.dataType = DataType.categorical;

        if (columnData.Levels) {
          column.levels = Object.entries(columnData.Levels).reduce(
            (acc, [levelKey, levelValue]) => {
              const annotationLevel = columnData.Annotations?.Levels?.[levelKey];
              const standardizedTerm =
                annotationLevel?.TermURL && standardizedTerms[annotationLevel.TermURL]
                  ? annotationLevel.TermURL
                  : '';

              return {
                ...acc,
                [levelKey]: {
                  description: levelValue.Description || '',
                  standardizedTerm,
                },
              };
            },
            {} as { [key: string]: { description: string; standardizedTerm: string } }
          );
        }
        break;

      case VariableType.continuous:
        column.dataType = DataType.continuous;

        if (columnData.Units !== undefined) {
          column.units = columnData.Units;
        }

        if (columnData.Annotations?.Format?.TermURL) {
          const formatId = columnData.Annotations.Format.TermURL;
          if (standardizedFormats[formatId]) {
            column.format = formatId;
          }
        }
        break;

      case VariableType.identifier:
        column.dataType = undefined;
        break;

      case VariableType.collection:
        column.dataType = undefined;

        if (columnData.Annotations?.IsPartOf?.TermURL) {
          const termId = columnData.Annotations.IsPartOf.TermURL;
          if (standardizedTerms[termId]) {
            column.isPartOf = termId;
          }
        }
        break;

      default:
        break;
    }

    return {
      ...updatedColumns,
      [columnId]: column,
    };
  }, columns);
}
