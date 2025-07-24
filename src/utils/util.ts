import axios from 'axios';
import { fetchConfigGitHubURL } from './constants';
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
    return await loadConfigFromPath(
      `https://raw.githubusercontent.com/neurobagel/communities/main/${selectedConfig}/config.json`
    );
  } catch (error) {
    // TODO: show a notif error
    // Fallback to default config when remote fetching fails
    try {
      return await loadConfigFromPath('/src/assets/default_config/config.json');
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
          // TODO: Remove this once we have a workflow for handling Healthy control
          if (termsFile.includes('diagnosis')) {
            allTerms.push({ label: 'Healthy Control', identifier: 'ncit:C94342' });
          }
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
