import { useMemo } from 'react';
import { Columns, DataType, StandardizedVariables } from '../utils/internal_types';

export interface ColumnCardData {
  columnId: string;
  name: string;
  description: string | null;
  dataType: DataType | null;
  standardizedVariableId: string | null;
  isDataTypeEditable: boolean;
  inferredDataTypeLabel: string | null;
}

export function useColumnCardData(
  columns: Columns,
  standardizedVariables: StandardizedVariables
): ColumnCardData[] {
  return useMemo(
    () =>
      Object.entries(columns).map(([columnId, column]) => {
        // Data type is editable when:
        // 1. No standardized variable is selected, OR
        // 2. The selected standardized variable is a multi-column measure
        const selectedStandardizedVariable = column.standardizedVariable
          ? standardizedVariables[column.standardizedVariable]
          : undefined;
        const isDataTypeEditable =
          !column.standardizedVariable ||
          selectedStandardizedVariable?.is_multi_column_measure === true;

        const inferredDataTypeLabel = isDataTypeEditable
          ? null
          : selectedStandardizedVariable?.variable_type || column.dataType || null;

        return {
          columnId,
          name: column.name,
          description: column.description || null,
          dataType: column.dataType || null,
          standardizedVariableId: column.standardizedVariable || null,
          isDataTypeEditable,
          inferredDataTypeLabel,
        };
      }),
    [columns, standardizedVariables]
  );
}
