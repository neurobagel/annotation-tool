import { useState } from 'react';
import { Typography, Paper, Collapse, Button, List, ListItemButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Columns } from '../utils/types';

interface SideColumnNavBarProps {
  columns: Columns;
  onSelectColumn: (columnId: string, columnDataType: 'Categorical' | 'Continuous' | null) => void;
  selectedColumnId: string | null;
}

function SideColumnNavBar({ columns, onSelectColumn, selectedColumnId }: SideColumnNavBarProps) {
  const [expanded, setExpanded] = useState({
    categorical: true,
    continuous: true,
    other: true,
  });

  const toggleExpansion = (type: 'categorical' | 'continuous' | 'other') => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  /* 
  TODO: once configuration is in and we have a way to designate certain columns
  like participant_id and session_id as "doesn't need value annotation", we can filter them out here
  */
  const categoricalColumns = Object.entries(columns).filter(
    ([_, column]) => column.dataType === 'Categorical'
  );
  const continuousColumns = Object.entries(columns).filter(
    ([_, column]) => column.dataType === 'Continuous'
  );
  const otherColumns = Object.entries(columns).filter(
    ([_, column]) => !column.dataType || column.dataType === null
  );

  return (
    <Paper className="w-full max-w-64 p-4" elevation={3} data-cy="side-column-nav-bar">
      <div data-cy="side-column-nav-bar-categorical">
        <Button
          data-cy="side-column-nav-bar-categorical-toggle-button"
          className="justify-start"
          fullWidth
          onClick={() => toggleExpansion('categorical')}
          endIcon={expanded.categorical ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          <Typography
            sx={{
              fontWeight:
                selectedColumnId && categoricalColumns.some(([id]) => id === selectedColumnId)
                  ? 'bold'
                  : 'normal',
            }}
          >
            Categorical
          </Typography>
        </Button>
        <Collapse in={expanded.categorical}>
          <List>
            {categoricalColumns.map(([columnId, column]) => (
              <ListItemButton
                data-cy={`side-column-nav-bar-categorical-${column.header}`}
                key={columnId}
                selected={selectedColumnId === columnId}
                onClick={() => onSelectColumn(columnId, 'Categorical')}
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

      <div data-cy="side-column-nav-bar-continuous">
        <Button
          data-cy="side-column-nav-bar-continuous-toggle-button"
          className="justify-start"
          fullWidth
          onClick={() => toggleExpansion('continuous')}
          endIcon={expanded.continuous ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          <Typography
            sx={{
              fontWeight:
                selectedColumnId && continuousColumns.some(([id]) => id === selectedColumnId)
                  ? 'bold'
                  : 'normal',
            }}
          >
            Continuous
          </Typography>
        </Button>
        <Collapse in={expanded.continuous}>
          <List>
            {continuousColumns.map(([columnId, column]) => (
              <ListItemButton
                data-cy={`side-column-nav-bar-continuous-${column.header}`}
                key={columnId}
                selected={selectedColumnId === columnId}
                onClick={() => onSelectColumn(columnId, 'Continuous')}
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

      <div data-cy="side-column-nav-bar-other">
        <Button
          data-cy="side-column-nav-bar-other-toggle-button"
          className="justify-start"
          fullWidth
          onClick={() => toggleExpansion('other')}
          endIcon={expanded.other ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          <Typography
            sx={{
              fontWeight:
                selectedColumnId && otherColumns.some(([id]) => id === selectedColumnId)
                  ? 'bold'
                  : 'normal',
            }}
          >
            Other
          </Typography>
        </Button>
        <Collapse in={expanded.other}>
          <List>
            {otherColumns.map(([columnId, column]) => (
              <ListItemButton
                data-cy={`side-column-nav-bar-other-${column.header}`}
                key={columnId}
                selected={selectedColumnId === columnId}
                onClick={() => onSelectColumn(columnId, null)}
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
    </Paper>
  );
}

export default SideColumnNavBar;
