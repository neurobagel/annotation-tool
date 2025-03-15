import { useState } from 'react';
import { Typography, Paper, Collapse, Button, List, ListItemButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Columns } from '../utils/types';

interface ColumnTypeCollapseProps {
  dataType: 'Categorical' | 'Continuous' | null;
  columns: Columns;
  onSelectColumn: (columnId: string, columnDataType: 'Categorical' | 'Continuous' | null) => void;
  selectedColumnId: string | null;
}

function ColumnTypeCollapse({
  dataType,
  columns,
  onSelectColumn,
  selectedColumnId,
}: ColumnTypeCollapseProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  function toggleExpansion() {
    setExpanded((prev) => !prev);
  }
  const dataTypeColumns = Object.entries(columns).filter(
    dataType
      ? ([_, column]) => column.dataType === dataType
      : ([_, column]) => !column.dataType || column.dataType === null
  );
  const dataTypeLabel = dataType ? dataType.toLocaleLowerCase() : 'other';

  return (
    <div data-cy={`side-column-nav-bar-${dataTypeLabel}`}>
      <Button
        data-cy={`side-column-nav-bar-${dataTypeLabel}-toggle-button`}
        className="justify-start"
        fullWidth
        onClick={() => toggleExpansion()}
        endIcon={expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        <Typography
          sx={{
            fontWeight:
              selectedColumnId && dataTypeColumns.some(([id]) => id === selectedColumnId)
                ? 'bold'
                : 'normal',
          }}
        >
          {dataTypeLabel.charAt(0).toUpperCase() + dataTypeLabel.slice(1)}
        </Typography>
      </Button>
      <Collapse in={expanded}>
        <List>
          {dataTypeColumns.map(([columnId, column]) => (
            <ListItemButton
              data-cy={`side-column-nav-bar-${dataTypeLabel}-${column.header}`}
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
  /* 
  TODO: once configuration is in and we have a way to designate certain columns
  like participant_id and session_id as "doesn't need value annotation", we can filter them out here
  */
  return (
    <Paper className="w-full max-w-64 p-4" elevation={3} data-cy="side-column-nav-bar">
      <ColumnTypeCollapse
        dataType="Categorical"
        columns={columns}
        onSelectColumn={onSelectColumn}
        selectedColumnId={selectedColumnId}
      />
      <ColumnTypeCollapse
        dataType="Continuous"
        columns={columns}
        onSelectColumn={onSelectColumn}
        selectedColumnId={selectedColumnId}
      />
      <ColumnTypeCollapse
        dataType={null}
        columns={columns}
        onSelectColumn={onSelectColumn}
        selectedColumnId={selectedColumnId}
      />
    </Paper>
  );
}

export default SideColumnNavBar;
