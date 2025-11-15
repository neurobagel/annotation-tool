import { useColumns } from '~/stores/FreshNewStore';
import { ColumnOption } from '../types/multiColumnMeasureTypes';
import { UsePersistedMultiColumnCardsOutput } from './usePersistedMultiColumnCards';

/**
 * Returns column options for a variable with disabled state.
 * Columns are disabled if they're already mapped to any card.
 */
export function useColumnOptionsForMultiColumnMeasureVariable(
  variableId: string,
  cards: UsePersistedMultiColumnCardsOutput[]
): ColumnOption[] {
  const columns = useColumns();

  if (!variableId) return [];

  const mappedColumnIds = new Set(cards.flatMap((card) => card.mappedColumns));

  return Object.entries(columns)
    .filter(([_, col]) => col.standardizedVariable === variableId)
    .map(([id, col]) => ({
      id,
      label: col.name,
      disabled: mappedColumnIds.has(id),
    }));
}
