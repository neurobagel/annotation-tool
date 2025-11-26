import { useColumns, useStandardizedTerms } from '../stores/data';
import { StandardizedTerm } from '../utils/internal_types';

export interface UsePersistedMultiColumnCardsOutput {
  id: string; // termId for persisted cards
  term: StandardizedTerm | null; // null for draft cards (no term selected yet)
  mappedColumns: string[]; // column IDs
}

/**
 * Builds the persisted card list for a multi-column variable by finding cards for
 * terms flagged as collections and attaching any columns whose `isPartOf` points
 * to those terms.
 */

export function usePersistedMultiColumnCards(
  variableId: string
): UsePersistedMultiColumnCardsOutput[] {
  const columns = useColumns();
  const standardizedTerms = useStandardizedTerms();

  if (!variableId) return [];

  const seedCards = Object.values(standardizedTerms)
    .filter((term) => term.standardizedVariableId === variableId && term.isCollection)
    .map<UsePersistedMultiColumnCardsOutput>((term) => ({
      id: term.id,
      term,
      mappedColumns: [],
    }));

  const mappedCards = Object.entries(columns).reduce<
    Map<string, UsePersistedMultiColumnCardsOutput>
  >(
    (acc, [colId, column]) => {
      if (column.standardizedVariable !== variableId || !column.isPartOf) {
        return acc;
      }

      const term = standardizedTerms[column.isPartOf];
      if (!term) {
        return acc;
      }

      if (!acc.has(term.id)) {
        acc.set(term.id, {
          id: term.id,
          term,
          mappedColumns: [],
        });
      }

      acc.get(term.id)!.mappedColumns.push(colId);
      return acc;
    },
    new Map(seedCards.map((card) => [card.id, card]))
  );

  return Array.from(mappedCards.values());
}
