import { Box } from '@mui/material';
import { useColumns, useDataActions, useStandardizedVariables } from '~/stores/data';
import { useStandardizedVariableOptions } from '../hooks/useStandardizedVariableOptions';
import { ColumnAnnotationInstructions } from '../utils/instructions';
import { DataType } from '../utils/internal_types';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';

function ColumnAnnotation() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const {
    userUpdatesColumnDescription,
    userUpdatesColumnStandardizedVariable,
    userUpdatesColumnDataType,
  } = useDataActions();
  const standardizedVariableOptions = useStandardizedVariableOptions();

  const columnsArray = Object.entries(columns);

  const handleStandardizedVariableChange = (columnId: string, newId: string | null) => {
    userUpdatesColumnStandardizedVariable(columnId, newId);
  };

  const handleDataTypeChange = (
    columnId: string,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    let dataType: DataType | null;
    if (newDataType === 'Categorical') {
      dataType = DataType.categorical;
    } else if (newDataType === 'Continuous') {
      dataType = DataType.continuous;
    } else {
      dataType = null;
    }
    userUpdatesColumnDataType(columnId, dataType);
  };

  const columnCardData = columnsArray.map(([columnId, column]) => {
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
  });

  return (
    <div
      className="flex flex-col items-center gap-6 h-[70vh] overflow-hidden"
      data-cy="column-annotation-container"
    >
      <div className="w-full max-w-6xl flex flex-col h-full">
        <div className="p-4 flex-shrink-0">
          <Instruction title="Column Annotation" className="mb-0">
            <ColumnAnnotationInstructions />
          </Instruction>
        </div>

        {/* Global Header Row - Sticky */}
        <Box
          className="sticky top-0 z-10 mx-4 mt-2 border border-blue-200 border-b-0 shadow-sm rounded-t-lg backdrop-blur-sm bg-opacity-95 bg-gray-50"
          sx={{ borderColor: 'grey.200' }}
        >
          {/* Row 1: Main Labels */}
          <div className="grid grid-cols-[1fr_140px_250px] gap-4 px-4 pt-3 pb-1 items-end border-b border-gray-200">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Description
            </span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Data Type
            </span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Mapped Variable
            </span>
          </div>
        </Box>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3" data-cy="scrollable-container">
          {columnCardData.map((columnData) => (
            <div key={columnData.columnId} className="w-full">
              <ColumnAnnotationCard
                id={columnData.columnId}
                name={columnData.name}
                description={columnData.description}
                dataType={columnData.dataType}
                standardizedVariableId={columnData.standardizedVariableId}
                standardizedVariableOptions={standardizedVariableOptions}
                isDataTypeEditable={columnData.isDataTypeEditable}
                inferredDataTypeLabel={columnData.inferredDataTypeLabel}
                onDescriptionChange={userUpdatesColumnDescription}
                onDataTypeChange={handleDataTypeChange}
                onStandardizedVariableChange={handleStandardizedVariableChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColumnAnnotation;
