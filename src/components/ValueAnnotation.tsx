import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import useDataStore from '../stores/data';
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
            <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="On this page, you describe the values in the columns that you have annotated in an earlier step. On the left side you see an overview of columns organized by the standardized variables you have mapped them to." />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      In the <strong>Annotated</strong> section: columns you have mapped to a
                      standardized variable.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      In the <strong>Unannotated</strong> section: columns not mapped to a
                      standardized variable.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      <strong>Note:</strong> The “Other” subsection in the “Unannotated” section
                      lists any columns that you have neither mapped to a standardized variable, nor
                      selected a data type for. You cannot annotate the values of these columns. Go
                      back to the Column Annotation page to change this.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      To begin annotating, in the navigation section on the left, click on a
                      standardized variable (“Annotated” section), or on a data type (“Unannotated”
                      section). On the right side, the corresponding value annotation view opens.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      Column tabs: Every column that is mapped to the current standardized variable
                      has its own tab in the value annotation view. Switch between columns by
                      clicking on their tab to annotate all values.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Value: An overview of the unique values in the active column. This is what you are annotating." />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      <strong>Missing Value:</strong> Click the “Mark as missing” button if the
                      “Value” in this row represents a non-response or a missing response (e.g. the
                      “Value” is empty, or -999 or similar). If you are annotating a categorical
                      standardized variable, i.e. you have a “Standardized Term” field, but you
                      cannot find a good match in the term dropdown for your “Value”, then also mark
                      this row as missing.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      <strong>Standardized Term</strong> (categorical variables only): Select the
                      term from the dropdown that most closely matches the “Value” in this row. This
                      will later allow us to harmonize your dataset. If you cannot find a good
                      match, mark the value as missing instead.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      <strong>Description</strong> (categorical variables only): Write a human
                      readable description of what this value encodes or means.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      <strong>Format</strong> (continuous variables only): Select the format that
                      matches your “Values”. Refer to the examples.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText
                  primary={
                    <>
                      <strong>Units</strong> (continuous variables only): Write a human readable
                      description of the unit that your “Values” are encoded as. E.g. years, days,
                      etc.
                    </>
                  }
                />
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                <ListItemText primary="Once you have annotated the values of all columns, you can move on to the final step." />
              </ListItem>
            </List>
          </Instruction>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default ValueAnnotation;
