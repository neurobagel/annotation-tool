import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';

/**
 * Returns true if there are any multi-column measure variables that have at least one mapped column.
 * This is used to determine if the Multi-Column Measures view should be shown in the navigation flow.
 */
export function useHasMultiColumnMeasures(): boolean {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  return Object.values(columns).some((column) => {
    const varId = column.standardizedVariable;
    if (!varId) return false;

    const variable = standardizedVariables[varId];
    return variable?.is_multi_column_measure === true;
  });
}
