import axios from 'axios';
import { StandardizedVariables, StandardizedTerms, StandardizedFormats } from '../../datamodel';
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
