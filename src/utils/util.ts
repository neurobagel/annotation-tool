import seedrandom from 'seedrandom';
import { v4 as uuidv4 } from 'uuid';
import { MultiColumnMeasuresTerm, MultiColumnMeasuresTermCard, Columns } from './types';

// Utility functions for store

export async function getConfigDirs(): Promise<string[]> {
  try {
    const modules = import.meta.glob('../../configs/*/config.json');
    return Object.keys(modules).map((path) => path.split('/').slice(-2, -1)[0]);
  } catch (error) {
    return [];
  }
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
  assessmentToolColumns,
  generateID,
}: {
  columns: Columns;
  terms: MultiColumnMeasuresTerm[];
  assessmentToolColumns: { id: string }[];
  generateID: () => string;
}): MultiColumnMeasuresTermCard[] {
  const cardMap = new Map<string, MultiColumnMeasuresTermCard>();

  assessmentToolColumns.forEach(({ id }) => {
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
  assessmentToolIdentifier: string,
  allMappedColumns: string[]
): { id: string; label: string; disabled: boolean }[] {
  return Object.entries(columns)
    .filter(([_, column]) => column.standardizedVariable?.identifier === assessmentToolIdentifier)
    .map(([id, column]) => ({
      id,
      label: column.header,
      disabled: allMappedColumns.includes(id),
    }));
}
