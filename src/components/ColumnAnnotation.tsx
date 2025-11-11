import { useColumns, useStandardizedVariables, useFreshDataActions } from '~/stores/FreshNewStore';
import { DataType } from '../../datamodel';
import { useStandardizedVariableOptions } from '../hooks/useStandardizedVariableOptions';
import { ColumnAnnotationInstructions } from '../utils/instructions';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';

function ColumnAnnotation() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const {
    userUpdatesColumnDescription,
    userUpdatesColumnStandardizedVariable,
    userUpdatesColumnDataType,
  } = useFreshDataActions();
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
    const isDataTypeEditable =
      !column.standardizedVariable ||
      standardizedVariables[column.standardizedVariable]?.is_multi_column_measure === true;

    return {
      columnId,
      name: column.name,
      description: column.description || null,
      dataType: column.dataType || null,
      standardizedVariableId: column.standardizedVariable || null,
      isDataTypeEditable,
    };
  });

  return (
    <div
      className="flex flex-col items-center gap-6 h-[70vh] overflow-auto"
      data-cy="column-annotation-container"
    >
      <div className="w-full max-w-5xl">
        <Instruction title="Column Annotation" className="mb-2">
          <ColumnAnnotationInstructions />
        </Instruction>
      </div>
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
            onDescriptionChange={userUpdatesColumnDescription}
            onDataTypeChange={handleDataTypeChange}
            onStandardizedVariableChange={handleStandardizedVariableChange}
          />
        </div>
      ))}
    </div>
  );
}
export default ColumnAnnotation;
