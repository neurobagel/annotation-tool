import { DataType } from '../../utils/internal_types';

export interface MockColumn {
  id: string;
  name: string;
  description: string | null;
  dataType: DataType | null;
  standardizedVariableId: string | null;
  isDataTypeEditable: boolean;
  inferredDataTypeLabel: string | null;
}
