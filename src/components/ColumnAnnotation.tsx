import Pagination from '@mui/material/Pagination';
import { useColumnUpdates, usePagination } from '../hooks';
import useDataStore from '../stores/data';
import { Column } from '../utils/internal_types';
import ColumnAnnotationCard from './ColumnAnnotationCard';

function ColumnAnnotation() {
  const { columns, standardizedVariables } = useDataStore();

  const { handleDescriptionChange, handleDataTypeChange, handleStandardizedVariableChange } =
    useColumnUpdates();

  const columnsArray = Object.entries(columns);

  const {
    currentPage,
    currentItems: currentColumns,
    totalPages,
    handlePaginationChange,
  } = usePagination<[string, Column]>(columnsArray, 3);

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
          standardizedVariableOptions={standardizedVariables}
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
          data-cy="pagination"
        />
      </div>
    </div>
  );
}
export default ColumnAnnotation;
