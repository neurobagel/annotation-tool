import { useColumnUpdates } from '../hooks';
import useDataStore from '../stores/data';
import ColumnAnnotationCard from './ColumnAnnotationCard';

function ColumnAnnotation() {
  const { columns, standardizedVariables } = useDataStore();

  const { handleDescriptionChange, handleDataTypeChange, handleStandardizedVariableChange } =
    useColumnUpdates();

  const columnsArray = Object.entries(columns);

  return (
    <div
      className="flex flex-col items-center gap-6 w-full max-h-[70vh] overflow-y-auto px-4 py-4"
      data-cy="column-annotation-container"
    >
      {columnsArray.map(([columnId, column]) => (
        <div key={columnId} className="w-full flex-shrink-0 min-h-fit">
          <ColumnAnnotationCard
            id={columnId}
            header={column.header}
            description={column.description || null}
            dataType={column.dataType || null}
            standardizedVariable={column.standardizedVariable || null}
            standardizedVariableOptions={standardizedVariables}
            onDescriptionChange={handleDescriptionChange}
            onDataTypeChange={handleDataTypeChange}
            onStandardizedVariableChange={handleStandardizedVariableChange}
          />
        </div>
      ))}
    </div>
  );
}
export default ColumnAnnotation;
