import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import { useColumnsMetadata } from '../hooks/useColumnsMetadata';
import { useValueAnnotationColumn } from '../hooks/useValueAnnotationColumn';
import { useValueAnnotationNavData } from '../hooks/useValueAnnotationNavData';
import { useFreshDataActions } from '../stores/FreshNewStore';
import { ValueAnnotationInstructions } from '../utils/instructions';
import Instruction from './Instruction';
import SideColumnNavBar from './SideColumnNavBar';
import ValueAnnotationTabs from './ValueAnnotationTabs';

function ValueAnnotation() {
  const {
    userUpdatesColumnLevelDescription,
    userUpdatesColumnUnits,
    userUpdatesColumnMissingValues,
    userUpdatesColumnFormat,
    userUpdatesColumnLevelTerm,
  } = useFreshDataActions();
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const navData = useValueAnnotationNavData();

  const handleSelect = (params: {
    columnIDs: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => {
    setSelectedColumnIds(params.columnIDs);
    setActiveColumnId((current) => {
      if (params.columnIDs.length === 0) {
        return null;
      }
      if (!current || !params.columnIDs.includes(current)) {
        return params.columnIDs[0];
      }
      return current;
    });
  };

  const columnMetadata = useColumnsMetadata(selectedColumnIds);

  const unknownDataTypeColumns = selectedColumnIds.filter(
    (id) => !columnMetadata[id]?.dataType && !columnMetadata[id]?.isMultiColumnMeasure
  );
  const activeColumn = useValueAnnotationColumn(activeColumnId);

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

    // Multi-column measure groups intentionally lack a data type; they render as continuous by default.
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
                  <ListItemText primary={columnMetadata[columnId]?.name || columnId} />
                </ListItem>
              ))}
            </List>
          </Typography>
        </Paper>
      );
    }

    if (!activeColumn || !activeColumnId) {
      return (
        <Paper elevation={3} className="flex h-full items-center justify-center shadow-lg">
          <Typography variant="h6">Selected column data is unavailable.</Typography>
        </Paper>
      );
    }

    return (
      <ValueAnnotationTabs
        columnOrder={selectedColumnIds}
        columnsMeta={columnMetadata}
        activeColumnId={activeColumnId}
        activeColumn={activeColumn}
        onChangeActiveColumn={setActiveColumnId}
        onUpdateDescription={userUpdatesColumnLevelDescription}
        onUpdateUnits={userUpdatesColumnUnits}
        onToggleMissingValue={userUpdatesColumnMissingValues}
        onUpdateFormat={userUpdatesColumnFormat}
        onUpdateLevelTerm={userUpdatesColumnLevelTerm}
      />
    );
  };

  return (
    <div className="mx-auto flex flex-col w-full max-w-7xl p-4">
      <div className="mb-4">
        <Instruction title="Value Annotation">
          <ValueAnnotationInstructions />
        </Instruction>
      </div>
      <div className="flex w-full max-h-[calc(100vh-320px)] space-x-4">
        <SideColumnNavBar
          annotatedGroups={navData.annotatedGroups}
          unannotatedGroups={navData.unannotatedGroups}
          onSelect={handleSelect}
          selectedColumnId={selectedColumnIds[0] || null}
        />
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}

export default ValueAnnotation;
