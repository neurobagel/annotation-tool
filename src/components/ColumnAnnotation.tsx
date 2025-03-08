import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { StandardizedVarible } from '~/utils/types';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import useDataStore from '../stores/data';

function ColumnAnnotation() {
  const columns = useDataStore((state) => state.columns);
  const standardizedVariableOptions = useDataStore((state) => state.standardizedVaribles);
  const updateColumnDescription = useDataStore((state) => state.updateColumnDescription);
  const updateColumnDataType = useDataStore((state) => state.updateColumnDataType);
  const updateColumnStandardizedVariable = useDataStore(
    (state) => state.updateColumnStandardizedVariable
  );

  const [currentPage, setCurrentPage] = useState(1);
  const columnsPerPage = 3;

  const columnEntries = Object.entries(columns);
  const indexOfLastColumn = currentPage * columnsPerPage;
  const indexOfFirstColumn = indexOfLastColumn - columnsPerPage;
  const currentColumns = columnEntries.slice(indexOfFirstColumn, indexOfLastColumn);

  const totalPages = Math.ceil(columnEntries.length / columnsPerPage);

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleDescriptionChange = (columnId: string, newDescription: string | null) => {
    updateColumnDescription(columnId, newDescription);
  };

  const handleDataTypeChange = (
    columnId: string,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    updateColumnDataType(columnId, newDataType);
  };

  const handleStandardizedVariableChange = (
    columnId: string,
    newStandardizedVariable: StandardizedVarible | null
  ) => {
    updateColumnStandardizedVariable(columnId, newStandardizedVariable);
  };

  return (
    <div className="flex flex-col items-center">
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
