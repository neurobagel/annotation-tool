import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import useDataStore from '../stores/data';
import { ValueAnnotationInstructions } from '../utils/instructions';
import { Columns } from '../utils/internal_types';
import Instruction from './Instruction';
import SideColumnNavBar from './SideColumnNavBar';
import ValueAnnotationTabs from './ValueAnnotationTabs';

function ValueAnnotation() {
  const {
    columns,
    dataTable,
    updateColumnLevelDescription,
    updateColumnUnits,
    updateColumnMissingValues,
    updateColumnFormat,
    updateColumnLevelTerm,
  } = useDataStore();
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);

  const handleSelect = (params: {
    columnIDs: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => {
    setSelectedColumnIds(params.columnIDs);
  };

  const filteredColumns = selectedColumnIds.reduce(
    (acc, columnId) => ({
      ...acc,
      [columnId]: columns[columnId],
    }),
    {} as Columns
  );

  const filteredDataTable = selectedColumnIds.reduce(
    (acc, columnId) => ({
      ...acc,
      [columnId]: dataTable[columnId],
    }),
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

    const unknownDataTypeColumns = selectedColumnIds.filter(
      (id) => !filteredColumns[id].variableType
    );

    if (unknownDataTypeColumns.length !== 0) {
      return (
        <Paper
          data-cy="other"
          elevation={3}
          className="flex h-full items-center justify-center shadow-lg"
        >
          <Typography variant="h6" component="div">
            {`The following column${
              unknownDataTypeColumns.length > 1 ? 's' : ''
            } do not have an assigned data type:`}
            <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
              {unknownDataTypeColumns.map((columnId) => (
                <ListItem key={columnId} sx={{ display: 'list-item' }}>
                  <ListItemText primary={filteredColumns[columnId].header} />
                </ListItem>
              ))}
            </List>
          </Typography>
        </Paper>
      );
    }

    return (
      <ValueAnnotationTabs
        columns={filteredColumns}
        dataTable={filteredDataTable}
        onUpdateDescription={updateColumnLevelDescription}
        onUpdateUnits={updateColumnUnits}
        onToggleMissingValue={updateColumnMissingValues}
        onUpdateFormat={updateColumnFormat}
        onUpdateLevelTerm={updateColumnLevelTerm}
      />
    );
  };

  return (
    <div
      className="mx-auto flex w-full  max-h-[calc(100vh-250px)]
  max-w-7xl space-x-4 p-4"
    >
      <SideColumnNavBar
        columns={columns}
        onSelect={handleSelect}
        selectedColumnId={selectedColumnIds[0] || null}
      />
      <div className="flex-1">
        <div className="mb-2">
          <Instruction title="Value Annotation">
            <ValueAnnotationInstructions />
          </Instruction>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default ValueAnnotation;
