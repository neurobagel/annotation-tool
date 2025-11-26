import { useColumns, useStandardizedVariables } from '../stores/data';
import { StandardizedVariable } from '../utils/internal_types';

/**
 * Returns list of multi-column measure variables that have at least one mapped column.
 * These are variables that:
 * - is_multi_column_measure = true
 * - At least one column has this variable as its standardizedVariable
 */
export function useMultiColumnMeasureVariables(): StandardizedVariable[] {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  const seenIds = new Set<string>();
  const result: StandardizedVariable[] = [];

  Object.values(columns).forEach((column) => {
    const varId = column.standardizedVariable;
    if (varId && !seenIds.has(varId)) {
      const variable = standardizedVariables[varId];
      if (variable?.is_multi_column_measure) {
        seenIds.add(varId);
        result.push(variable);
      }
    }
  });

  return result;
}
