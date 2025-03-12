import { useState } from 'react';
import { Typography } from '@mui/material';
import useDataStore from '../stores/data';
import SideColumnNavBar from './SideColumnNavBar';
import Categorical from './Categorical';
import Continuous from './Continuous';

function ValueAnnotation() {
  const columns = useDataStore((state) => state.columns);
  const dataTable = useDataStore((state) => state.dataTable);
  const updateColumnLevelDescription = useDataStore((state) => state.updateColumnLevelDescription);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const handleSelectColumn = (columnId: string | null) => {
    setSelectedColumnId(columnId);
  };

  const handleUpdateDescription = (columnId: string, value: string, description: string) => {
    updateColumnLevelDescription(columnId, value, description);
  };

  const renderContent = () => {
    if (!selectedColumnId) {
      return <Typography variant="h6">Select a column to annotate values.</Typography>;
    }

    const selectedColumn = columns[selectedColumnId];
    const columnData = dataTable[selectedColumnId];
    const uniqueValues = columnData ? Array.from(new Set(columnData)) : [];

    switch (selectedColumn.dataType) {
      case 'Categorical':
        return (
          <Categorical
            columnId={selectedColumnId}
            uniqueValues={uniqueValues}
            levels={selectedColumn.levels || {}}
            onUpdateDescription={handleUpdateDescription}
          />
        );
      case 'Continuous':
        return <Continuous />;
      default:
        return (
          <Typography data-cy="other-placeholder" variant="h6">
            Please select the appropriate data type for this column.
          </Typography>
        );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-row space-x-4 p-4">
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
