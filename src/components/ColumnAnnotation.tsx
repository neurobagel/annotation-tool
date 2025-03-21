import Pagination from '@mui/material/Pagination';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import useDataStore from '../stores/data';
import { useColumnUpdates, usePagination } from '../hooks';

function ColumnAnnotation() {
  const columns = useDataStore((state) => state.columns);
  const standardizedVariableOptions = useDataStore((state) => state.standardizedVaribles);

  const { handleDescriptionChange, handleDataTypeChange, handleStandardizedVariableChange } =
    useColumnUpdates();

  const {
    currentPage,
    currentItems: currentColumns,
    totalPages,
    handlePaginationChange,
  } = usePagination(columns, 3);

  return (
    <div className="flex flex-col items-center gap-4">
      {currentColumns.map(([columnId, column]) => (
        <ColumnAnnotationCard
          key={columnId}
          id={columnId}
          header={column.header}
          description={column.description || null}
          dataType={column.dataType || null}
          standardizedVariable={column.standardizedVariable || null}
          standardizedVariableOptions={standardizedVariableOptions}
          onDescriptionChange={handleDescriptionChange}
          onDataTypeChange={handleDataTypeChange}
          onStandardizedVariableChange={handleStandardizedVariableChange}
        />
      ))}

      <div className="my-4" data-cy="column-annotation-pagination">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePaginationChange}
          color="primary"
          shape="rounded"
        />
      </div>
    </div>
  );
}

export default ColumnAnnotation;
