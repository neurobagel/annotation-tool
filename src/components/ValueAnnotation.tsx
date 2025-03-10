import { useState } from 'react';
import { Typography, Paper } from '@mui/material';
import useDataStore from '../stores/data';
import SideColumnNavBar from './SideColumnNavBar';
import Categorical from './Categorical';
import Continuous from './Continuous';

function ValueAnnotation() {
  const columns = useDataStore((state) => state.columns);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [selectedColumnDataType, setSelectedColumnDataType] = useState<
    'Categorical' | 'Continuous' | null
  >(null);

  const handleSelectColumn = (
    columnId: string | null,
    columnDataType: 'Categorical' | 'Continuous' | null
  ) => {
    setSelectedColumnId(columnId);
    setSelectedColumnDataType(columnDataType);
  };

  const renderContent = () => {
    if (!selectedColumnId) {
      return <Typography variant="h6">Select a column to annotate values.</Typography>;
    }

    switch (selectedColumnDataType) {
      case 'Categorical':
        return <Categorical />;
      case 'Continuous':
        return <Continuous />;
      default:
        return (
          <Typography variant="h6">
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
      <Paper className="flex-1 p-4 shadow-lg" elevation={3}>
        {renderContent()}
      </Paper>
    </div>
  );
}

export default ValueAnnotation;
