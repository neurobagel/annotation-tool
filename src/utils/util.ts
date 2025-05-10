import useDataStore from '~/stores/data';
import { Term, TermCard, Columns, StandardizedVariable } from './types';

// Utility functions for MultiColumnMeasures component

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

// Utility functions for the SideColumnNavbar component on the value annotation view
export function getMappedStandardizedVariables(columns: Columns): StandardizedVariable[] {
  const { config } = useDataStore.getState();
  const seenIdentifiers = new Set<string>();
  const uniqueVariables: StandardizedVariable[] = [];

  Object.values(columns).forEach((column) => {
    const variable = column.standardizedVariable;
    if (variable && !seenIdentifiers.has(variable.identifier)) {
      const configEntry = Object.values(config).find(
        (configItem) => configItem.identifier === variable.identifier
      );
      // Filter out variables with null data_type e.g., Subject ID, Session ID
      if (configEntry?.data_type !== null) {
        seenIdentifiers.add(variable.identifier);
        uniqueVariables.push(variable);
      }
    }
  });

  return uniqueVariables;
}
