import { StandardizedVariable } from '../../datamodel';
import { useColumns, useStandardizedVariables } from '../stores/FreshNewStore';

export interface ColumnStandardizedVariable {
  standardizedVariableId: string;
  standardizedVariable: StandardizedVariable;
  isMultiColumnMeasure: boolean;
}

/**
 * Returns the standardized variable metadata for a column along with multi-column measure flags.
 */
export function useColumnStandardizedVariable(columnId: string): ColumnStandardizedVariable | null {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  const standardizedVariableId = columns[columnId].standardizedVariable;

  if (!standardizedVariableId) {
    return null;
  }

  const standardizedVariable = standardizedVariables[standardizedVariableId];

  return {
    standardizedVariableId,
    standardizedVariable,
    isMultiColumnMeasure: Boolean(standardizedVariable.is_multi_column_measure),
  };
}

export default useColumnStandardizedVariable;
