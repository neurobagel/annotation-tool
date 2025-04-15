import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Typography, Paper, Collapse, Button, List, ListItem, ListItemButton } from '@mui/material';
import { useState } from 'react';
import { Columns, StandardizedVariable } from '../utils/types';
import { getMappedStandardizedVariables } from '../utils/util';

interface ColumnTypeCollapseProps {
  dataType?: 'Categorical' | 'Continuous' | null;
  standardizedVariable?: StandardizedVariable | null;
  columns: Columns;
  onSelectColumn: (columnId: string, columnDataType: 'Categorical' | 'Continuous' | null) => void;
  selectedColumnId: string | null;
}

function ColumnTypeCollapse({
  dataType = null,
  standardizedVariable = null,
  columns,
  onSelectColumn,
  selectedColumnId,
}: ColumnTypeCollapseProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  function toggleExpansion() {
    setExpanded((prev) => !prev);
  }
  let columnsToDisplay;
  // TODO: find a better name for the below variable
  let labelToDisplay;
  if (standardizedVariable) {
    columnsToDisplay = Object.entries(columns).filter(
      ([_, column]) => column.standardizedVariable?.identifier === standardizedVariable.identifier
    );
    labelToDisplay = standardizedVariable.label;
  } else {
    columnsToDisplay = Object.entries(columns).filter(
      dataType
        ? ([_, column]) => column.standardizedVariable === null && column.dataType === dataType
        : ([_, column]) =>
            (column.standardizedVariable === null && !column.dataType) || column.dataType === null
    );
    labelToDisplay = dataType ? dataType.toLocaleLowerCase() : 'other';
  }

  return (
    <div data-cy={`side-column-nav-bar-${labelToDisplay}`}>
      <Button
        data-cy={`side-column-nav-bar-${labelToDisplay}-toggle-button`}
        className="justify-start"
        fullWidth
        onClick={() => toggleExpansion()}
        endIcon={expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        <Typography
          sx={{
            fontWeight:
              selectedColumnId && columnsToDisplay.some(([id]) => id === selectedColumnId)
                ? 'bold'
                : 'normal',
          }}
        >
          {labelToDisplay.charAt(0).toUpperCase() + labelToDisplay.slice(1)}
        </Typography>
      </Button>
      <Collapse in={expanded}>
        <List>
          {columnsToDisplay.map(([columnId, column]) => (
            <ListItemButton
              data-cy={`side-column-nav-bar-${labelToDisplay}-${column.header}`}
              key={columnId}
              selected={selectedColumnId === columnId}
              onClick={() => onSelectColumn(columnId, dataType)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography>{column.header}</Typography>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </div>
  );
}

interface SideColumnNavBarProps {
  columns: Columns;
  onSelectColumn: (columnId: string, columnDataType: 'Categorical' | 'Continuous' | null) => void;
  selectedColumnId: string | null;
}

function SideColumnNavBar({ columns, onSelectColumn, selectedColumnId }: SideColumnNavBarProps) {
  const mappedStandardizedVariables = getMappedStandardizedVariables(columns);
  const [expanded, setExpanded] = useState<boolean>(true);
  function toggleExpansion() {
    setExpanded((prev) => !prev);
  }
  /* 
  TODO: once configuration is in and we have a way to designate certain columns
  like participant_id and session_id as "doesn't need value annotation", we can filter them out here
  */
  return (
    <Paper className="w-full max-w-64 p-4" elevation={3} data-cy="side-column-nav-bar">
      <Button
        className="justify-start"
        fullWidth
        onClick={() => toggleExpansion()}
        endIcon={expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        <Typography>Annotated</Typography>
      </Button>
      <Collapse in={expanded}>
        <List>
          {mappedStandardizedVariables.map((standardizedVariable) => (
            <ListItemButton>
              <ColumnTypeCollapse
                dataType={null}
                standardizedVariable={standardizedVariable}
                columns={columns}
                onSelectColumn={onSelectColumn}
                selectedColumnId={selectedColumnId}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      <Button
        className="justify-start"
        fullWidth
        onClick={() => toggleExpansion()}
        endIcon={expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        <Typography>Unannotated</Typography>
      </Button>
      <Collapse in={expanded}>
        <List>
          {['Categorical', 'Continuous', null].map((dataType) => (
            <ListItemButton>
              <ColumnTypeCollapse
                dataType={dataType as 'Categorical' | 'Continuous' | null}
                columns={columns}
                onSelectColumn={onSelectColumn}
                selectedColumnId={selectedColumnId}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
}

export default SideColumnNavBar;
