import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { StandardizedVarible } from '~/utils/types';
import NavigationButton from './NavigationButton';
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

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleDescriptionChange = (columnId: number, newDescription: string | null) => {
    updateColumnDescription(columnId, newDescription);
  };

  const handleDataTypeChange = (
    columnId: number,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    updateColumnDataType(columnId, newDataType);
  };

  const handleStandardizedVariableChange = (
    columnId: number,
    newStandardizedVariable: StandardizedVarible | null
  ) => {
    updateColumnStandardizedVariable(columnId, newStandardizedVariable);
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Column Annotation</h1>
      {currentColumns.map(([columnId, column]) => (
        <ColumnAnnotationCard
          key={columnId}
          id={parseInt(columnId, 10)}
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

      <div className="my-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </div>

      <div className="flex space-x-4">
        <NavigationButton label="Back - Upload" viewToNavigateTo="upload" />
        <NavigationButton label="Next - Value Annotation" viewToNavigateTo="valueAnnotation" />
      </div>
    </div>
  );
}

export default ColumnAnnotation;
