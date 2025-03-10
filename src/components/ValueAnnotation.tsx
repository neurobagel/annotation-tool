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
        return <Typography variant="h6">Please select a valid column type.</Typography>;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <SideColumnNavBar
          columns={columns}
          onSelectColumn={handleSelectColumn}
          selectedColumnId={selectedColumnId}
        />
        <Paper className="flex-2 ml-4 max-w-2xl p-4" elevation={3}>
          {renderContent()}
        </Paper>
      </div>
    </div>
  );
}

export default ValueAnnotation;
