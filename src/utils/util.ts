import seedrandom from 'seedrandom';
import { v4 as uuidv4 } from 'uuid';
import { Term, TermCard, Columns } from './types';

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
  terms: Term[];
  assessmentToolColumns: { id: string }[];
  generateID: () => string;
}): TermCard[] {
  const cardMap = new Map<string, TermCard>();

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

export const getAllMappedColumns = (termCards: TermCard[]) =>
  termCards.flatMap((card) => card.mappedColumns);

export function getAssignedTermIdentifiers(
  termCards: TermCard[],
  currentCardId?: string
): string[] {
  return termCards
    .filter((card) => card.term !== null && card.id !== currentCardId)
    .map((card) => card.term!.identifier);
}

export function getAvailableTerms(
  allTerms: Term[],
  usedIdentifiers: string[]
): (Term & { disabled: boolean })[] {
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
