import axios from 'axios';
import {
  ConfigFile,
  VocabConfig,
  TermsFileStandardizedTerm,
  ConfigFileTermFormat,
  ConfigFileStandardizedVariable,
} from './external_types';
import {
  Config,
  MultiColumnMeasuresTerm,
  MultiColumnMeasuresTermCard,
  Columns,
  StandardizedTerm,
  TermFormat,
} from './internal_types';

// Utility functions for store

export async function fetchAvailableConfigs(): Promise<string[]> {
  try {
    const response = await axios.get(
      'https://api.github.com/repos/neurobagel/communities/contents/'
    );
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
  const configRes = await axios.get(configPath);
  const configArray = configRes.data;
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

/*
 Simple deterministic ID generator
 so we can reliably prouduce consistent UUIDs for testing.
*/
export function deterministicIdGenerator() {
  let counter = 0;
  return () => {
    counter += 1;
    return `${counter}`;
  };
}

// Initialize term cards based on existing isPartOf relationships
export function initializeTermCards({
  columns,
  terms,
  variableColumns,
  generateID,
}: {
  columns: Columns;
  terms: MultiColumnMeasuresTerm[];
  variableColumns: { id: string }[];
  generateID: () => string;
}): MultiColumnMeasuresTermCard[] {
  const cardMap = new Map<string, MultiColumnMeasuresTermCard>();

  variableColumns.forEach(({ id }) => {
    const column = columns[id];
    const termIdentifier = column.isPartOf?.termURL;
    const term = termIdentifier && terms.find((t) => t.identifier === termIdentifier);

    if (!term) return;

    if (!cardMap.has(term.identifier)) {
      cardMap.set(term.identifier, {
        id: generateID(),
        term,
        mappedColumns: [],
      });
    }

    const card = cardMap.get(term.identifier)!;
    if (!card.mappedColumns.includes(id)) {
      card.mappedColumns.push(id);
    }
  });

  const termCards = Array.from(cardMap.values());
  return termCards.length > 0 ? termCards : [{ id: generateID(), term: null, mappedColumns: [] }];
}

export const getAllMappedColumns = (termCards: MultiColumnMeasuresTermCard[]) =>
  termCards.flatMap((card) => card.mappedColumns);

export function getAssignedTermIdentifiers(
  termCards: MultiColumnMeasuresTermCard[],
  currentCardId?: string
): string[] {
  return termCards
    .filter((card) => card.term !== null && card.id !== currentCardId)
    .map((card) => card.term!.identifier);
}

export function getAvailableTerms(
  allTerms: MultiColumnMeasuresTerm[],
  usedIdentifiers: string[]
): (MultiColumnMeasuresTerm & { disabled: boolean })[] {
  return allTerms.map((term) => ({
    ...term,
    disabled: usedIdentifiers.includes(term.identifier),
  }));
}

export function getColumnOptions(
  columns: Columns,
  standardizedVariableIdentifier: string,
  allMappedColumns: string[]
): { id: string; label: string; disabled: boolean }[] {
  return Object.entries(columns)
    .filter(
      ([_, column]) => column.standardizedVariable?.identifier === standardizedVariableIdentifier
    )
    .map(([id, column]) => ({
      id,
      label: column.header,
      disabled: allMappedColumns.includes(id),
    }));
}
