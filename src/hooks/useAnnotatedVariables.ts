import type { StandardizedVariable } from '../../datamodel';
import { useColumns, useStandardizedVariables } from '../stores/FreshNewStore';

export interface AnnotatedVariableGroup {
  standardizedVariableId: string;
  standardizedVariable: StandardizedVariable;
  columnIds: string[];
  isMultiColumnMeasure: boolean;
}

/**
 * Groups columns by their standardized variable.
 */
export function useAnnotatedVariables(): AnnotatedVariableGroup[] {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  const groups = Object.entries(columns).reduce<Record<string, AnnotatedVariableGroup>>(
    (acc, [columnId, column]) => {
      const standardizedVariableId = column.standardizedVariable;
      if (!standardizedVariableId) {
        return acc;
      }

      const existing = acc[standardizedVariableId];
      const variable = standardizedVariables[standardizedVariableId];
      const nextGroup = existing
        ? {
            ...existing,
            columnIds: [...existing.columnIds, columnId],
          }
        : {
            standardizedVariableId,
            standardizedVariable: variable,
            columnIds: [columnId],
            isMultiColumnMeasure: Boolean(variable.is_multi_column_measure),
          };

      return {
        ...acc,
        [standardizedVariableId]: nextGroup,
      };
    },
    {}
  );

  return Object.values(groups);
}

export default useAnnotatedVariables;
