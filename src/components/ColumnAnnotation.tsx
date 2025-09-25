import { useColumnUpdates } from '../hooks';
import useDataStore from '../stores/data';
import { ColumnAnnotationInstructions } from '../utils/instructions';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';

function ColumnAnnotation() {
  const { columns, standardizedVariables } = useDataStore();

  const { handleDescriptionChange, handleVariableTypeChange, handleStandardizedVariableChange } =
    useColumnUpdates();

  const columnsArray = Object.entries(columns);

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
      {columnsArray.map(([columnId, column]) => (
        <div key={columnId} className="w-full">
          <ColumnAnnotationCard
            id={columnId}
            header={column.header}
            description={column.description || null}
            variableType={column.variableType || null}
            standardizedVariable={column.standardizedVariable || null}
            standardizedVariableOptions={standardizedVariables}
            onDescriptionChange={handleDescriptionChange}
            onDataTypeChange={handleVariableTypeChange}
            onStandardizedVariableChange={handleStandardizedVariableChange}
          />
        </div>
      ))}
    </div>
  );
}
export default ColumnAnnotation;
