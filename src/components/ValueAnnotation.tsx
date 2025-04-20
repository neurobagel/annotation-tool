import { Paper, Typography } from '@mui/material';
import { useState } from 'react';
import useDataStore from '../stores/data';
import { Columns } from '../utils/types';
import SideColumnNavBar from './SideColumnNavBar';
import ValueAnnotationTabs from './ValueAnnotationTabs';

function ValueAnnotation() {
  const { columns, dataTable, updateColumnLevelDescription, updateColumnUnits } = useDataStore();
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);

  const handleSelect = (params: {
    columnIds: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => {
    setSelectedColumnIds(params.columnIds);
  };

  const filteredColumns = selectedColumnIds.reduce((acc, columnId) => {
    acc[columnId] = columns[columnId];
    return acc;
  }, {} as Columns);

  const filteredDataTable = selectedColumnIds.reduce(
    (acc, columnId) => {
      acc[columnId] = dataTable[columnId];
      return acc;
    },
    {} as Record<string, string[]>
  );

  const renderContent = () => {
    if (selectedColumnIds.length === 0) {
      return (
        <Paper
          data-cy="no-column-selected"
          elevation={3}
          className="flex h-full items-center justify-center shadow-lg"
        >
          <Typography variant="h6">Please select a column to annotate values.</Typography>
        </Paper>
      );
    }

    return (
      <ValueAnnotationTabs
        columns={filteredColumns}
        dataTable={filteredDataTable}
        onUpdateDescription={updateColumnLevelDescription}
        onUpdateUnits={updateColumnUnits}
      />
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl space-x-4 p-4">
      <SideColumnNavBar
        columns={columns}
        onSelect={handleSelect}
        selectedColumnId={selectedColumnIds[0] || null}
      />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}

export default ValueAnnotation;
