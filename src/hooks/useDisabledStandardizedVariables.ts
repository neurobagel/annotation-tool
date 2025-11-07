import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';

/**
 * Returns a Set of standardized variable labels that should be disabled in the dropdown.
 * These are variables that:
 * 1. Are already mapped to at least one column
 * 2. Have can_have_multiple_columns = false (single-column only)
 * 3. Are not multi-column measures
 */
export function useDisabledStandardizedVariables(): Set<string> {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  const disabledLabels = new Set<string>();

  Object.values(columns).forEach((column) => {
    const variableId = column.standardizedVariable;

    if (variableId) {
      const variable = standardizedVariables[variableId];

      if (variable) {
        // Only include if it's a single-column variable (not multi-column measure and can't have multiple columns)
        const isSingleColumn =
          variable.is_multi_column_measure !== true && variable.can_have_multiple_columns === false;

        if (isSingleColumn) {
          disabledLabels.add(variable.name);
        }
      }
    }
  });

  return disabledLabels;
}
