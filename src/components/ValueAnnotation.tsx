import { Paper, Typography } from '@mui/material';
import { useState } from 'react';
import useDataStore from '../stores/data';
import Categorical from './Categorical';
import Continuous from './Continuous';
import SideColumnNavBar from './SideColumnNavBar';

function ValueAnnotation() {
  const { columns, dataTable, updateColumnLevelDescription, updateColumnUnits } = useDataStore();
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const handleSelectColumn = (columnId: string | null) => {
    setSelectedColumnId(columnId);
  };

  const handleUpdateDescription = (columnId: string, value: string, description: string) => {
    updateColumnLevelDescription(columnId, value, description);
  };

  const handleUpdateUnits = (columnId: string, units: string) => {
    updateColumnUnits(columnId, units);
  };

  const renderContent = () => {
    if (!selectedColumnId) {
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

    const selectedColumn = columns[selectedColumnId];
    const columnData = dataTable[selectedColumnId];
    const uniqueValues = columnData ? Array.from(new Set(columnData)) : [];

    switch (selectedColumn.dataType) {
      case 'Categorical':
        return (
          <Categorical
            columnID={selectedColumnId}
            uniqueValues={uniqueValues}
            levels={selectedColumn.levels || {}}
            onUpdateDescription={handleUpdateDescription}
          />
        );
      case 'Continuous':
        return (
          <Continuous
            columnID={selectedColumnId}
            units={selectedColumn.units || ''}
            onUpdateUnits={handleUpdateUnits}
          />
        );
      default:
        return (
          <Paper
            data-cy="other-placeholder"
            elevation={3}
            className="flex h-full items-center justify-center shadow-lg"
          >
            <Typography variant="h6">
              Please select the appropriate data type for this column.
            </Typography>
          </Paper>
        );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl space-x-4 p-4">
      <SideColumnNavBar
        columns={columns}
        onSelectColumn={handleSelectColumn}
        selectedColumnId={selectedColumnId}
      />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}

export default ValueAnnotation;
