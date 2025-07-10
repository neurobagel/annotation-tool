import axios from 'axios';
import seedrandom from 'seedrandom';
import { v4 as uuidv4 } from 'uuid';
import {
  ConfigFile,
  Config,
  MultiColumnMeasuresTerm,
  MultiColumnMeasuresTermCard,
  VocabConfig,
  Columns,
  StandardizedTerm,
  TermsFileStandardizedTerm,
  ConfigFileTermFormat,
  ConfigFileStandardizedVariable,
  TermFormat,
} from './types';

// Utility functions for store

export async function fetchAvailableConfigNames(): Promise<string[]> {
  try {
    const response = await axios.get(
      'https://api.github.com/repos/neurobagel/communities/contents/'
    );
    const data = response.data as { type: string; name: string }[];
    const dirs = data.filter((item) => item.type === 'dir');
    return dirs.map((dir) => dir.name);
  } catch (error) {
    // TODO: show a notif error
    return [];
  }
}

export async function fetchConfig(
  selectedConfig: string
): Promise<{ config: ConfigFile; termsData: Record<string, VocabConfig[]> }> {
  try {
    // 1. Fetch config.json
    const configRes = await axios.get(
      `https://raw.githubusercontent.com/neurobagel/communities/main/${selectedConfig}/config.json`
    );
    const configArray = configRes.data;
    if (!Array.isArray(configArray) || configArray.length === 0) {
      throw new Error('Config file is not in expected format');
    }
    const config = configArray[0];

    // 2. Find all unique terms_file values in standardized_variables
    const termFiles = new Set<string>();
    config.standardized_variables.forEach((variable: ConfigFileStandardizedVariable) => {
      if (variable.terms_file) {
        termFiles.add(variable.terms_file);
      }
    });

    // 3. Fetch all term files
    const termsData: Record<string, VocabConfig[]> = {};
    await Promise.all(
      Array.from(termFiles).map(async (file) => {
        try {
          const res = await axios.get(
            `https://raw.githubusercontent.com/neurobagel/communities/main/${selectedConfig}/${file}`
          );
          termsData[file] = res.data;
        } catch (e) {
          // TODO: show notif error
          termsData[file] = [];
        }
      })
    );

    return { config, termsData };
  } catch (error) {
    // TODO: show a notif error
    return { config: {} as ConfigFile, termsData: {} };
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
          termURL: formatId,
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
Generate a UUID using a seeded random number generator
so we can reliably prouduce consistent UUIDs for testing.
*/

export function createSeededUuidGenerator(seed: string) {
  const rng = seedrandom(seed);
  const buffer = new Uint8Array(16);

  return () => {
    for (let i = 0; i < 16; i += 1) {
      buffer[i] = Math.floor(rng.quick() * 256);
    }
    return uuidv4({ rng: () => buffer });
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

// Simple deterministic ID generator
export function createDeterministicIdGenerator() {
  let counter = 0;
  return () => {
    counter += 1;
    return `${counter}`;
  };
}
