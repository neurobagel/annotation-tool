import { useColumns, useStandardizedVariables, useFreshDataActions } from '~/stores/FreshNewStore';
import { DataType } from '../../datamodel';
import { useDisabledStandardizedVariables } from '../hooks/useDisabledStandardizedVariables';
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
  const disabledStandardizedVariableLabels = useDisabledStandardizedVariables();

  const columnsArray = Object.entries(columns);

  const standardizedVariableLabels = Object.values(standardizedVariables).map((sv) => sv.name);

  const handleStandardizedVariableChange = (columnId: string, newLabel: string | null) => {
    const variableId = newLabel
      ? (Object.entries(standardizedVariables).find(([_, sv]) => sv.name === newLabel)?.[0] ?? null)
      : null;

    userUpdatesColumnStandardizedVariable(columnId, variableId);
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
    // Look up standardized variable label for auto complete
    const standardizedVariableLabel = column.standardizedVariable
      ? standardizedVariables[column.standardizedVariable]?.name || null
      : null;

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
      standardizedVariableLabel,
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
            standardizedVariableLabel={columnData.standardizedVariableLabel}
            standardizedVariableOptions={standardizedVariableLabels}
            isDataTypeEditable={columnData.isDataTypeEditable}
            disabledStandardizedVariableLabels={disabledStandardizedVariableLabels}
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
