import { useMemo } from 'react';
import {
  Columns,
  DataType,
  StandardizedVariables,
  StandardizedTerms,
} from '../utils/internal_types';

export interface ColumnCardData {
  columnId: string;
  name: string;
  description: string | null;
  dataType: DataType | null;
  standardizedVariableId: string | null;
  termId: string | null;
  termLabel: string | null;
  termAbbreviation: string | null;
  isDataTypeEditable: boolean;
  inferredDataTypeLabel: string | null;
}

export function useColumnCardData(
  columns: Columns,
  standardizedVariables: StandardizedVariables,
  standardizedTerms: StandardizedTerms
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

        const termId = column.isPartOf || null;
        let termLabel = null;
        let termAbbreviation = null;

        if (termId && standardizedTerms[termId]) {
          termLabel = standardizedTerms[termId].label;
          termAbbreviation = standardizedTerms[termId].abbreviation || null;
        }

        return {
          columnId,
          name: column.name,
          description: column.description || null,
          dataType: column.dataType || null,
          standardizedVariableId: column.standardizedVariable || null,
          termId,
          termLabel,
          termAbbreviation,
          isDataTypeEditable,
          inferredDataTypeLabel,
        };
      }),
    [columns, standardizedVariables, standardizedTerms]
  );
}
