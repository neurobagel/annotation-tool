import { useColumns, useStandardizedTerms } from '~/stores/data';
import { ColumnOption } from '../types/multiColumnMeasureTypes';

/**
 * Returns column options for a variable with disabled state.
 * Columns are disabled if they're already mapped to any Collection.
 */
export function useColumnOptionsForMultiColumnMeasureVariable(variableId: string): ColumnOption[] {
  const columns = useColumns();
  const standardizedTerms = useStandardizedTerms();

  if (!variableId) return [];

  const collectionTermIds = new Set(
    Object.values(standardizedTerms)
      .filter((term) => term.standardizedVariableId === variableId && term.isCollection)
      .map((term) => term.id)
  );

  return Object.entries(columns)
    .filter(([_, col]) => col.standardizedVariable === variableId)
    .map(([id, col]) => ({
      id,
      label: col.name,
      isPartOfCollection: !!(col.isPartOf && collectionTermIds.has(col.isPartOf)),
    }));
}
