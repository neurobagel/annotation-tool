import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Typography, Collapse, Button, List, ListItem, IconButton } from '@mui/material';
import { useState } from 'react';
import useDataStore from '~/stores/data';
import { ColumnEntry, Columns, StandardizedVariable } from '../utils/types';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSectionDefaultProps = {
  defaultExpanded: true,
};

export function ExpandableSection({
  title,
  children,
  defaultExpanded = true,
}: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <>
      <Button
        data-cy={`side-column-nav-bar-${title}-toggle-button`}
        className="justify-start pl-0"
        fullWidth
        onClick={() => setExpanded(!expanded)}
        startIcon={expanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
      >
        <Typography data-cy={`side-column-nav-bar-${title}`}>
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </Typography>
      </Button>
      <Collapse in={expanded}>{children}</Collapse>
    </>
  );
}

ExpandableSection.defaultProps = ExpandableSectionDefaultProps;

interface ColumnTypeCollapseProps {
  dataType?: 'Categorical' | 'Continuous' | null;
  standardizedVariable?: StandardizedVariable | null;
  columns: Columns;
  onSelect: (params: {
    columnIDs: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => void;
  selectedColumnId: string | null;
}

const ColumnTypeCollapseDefaultProps = {
  dataType: null,
  standardizedVariable: null,
};

/*
 A collapsible component that displays and organizes columns by their data type or standardized variable.
  
 Component provides:
   - A toggleable header showing either a data type ('Categorical', 'Continuous') or standardized variable label
   - Expandable/collapsible list of columns belonging to the category
   - Special handling for assessment tool columns (grouping them by their 'isPartOf' relationship)
   - Visual indication of selected columns (bold and primary color)
   - Ability to select individual columns or entire groups (for assessment tools)
 */
export function ColumnTypeCollapse({
  dataType = null,
  standardizedVariable = null,
  columns,
  onSelect,
  selectedColumnId,
}: ColumnTypeCollapseProps) {
  const [showColumns, setShowColumns] = useState<boolean>(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  let columnsToDisplay;
  // TODO: find a better name for the below variable
  let labelToDisplay;

  if (standardizedVariable) {
    columnsToDisplay = Object.entries(columns).filter(
      ([_, column]) => column.standardizedVariable?.identifier === standardizedVariable.identifier
    );
    labelToDisplay = standardizedVariable.label.toLocaleLowerCase();
  } else {
    columnsToDisplay = Object.entries(columns).filter(
      dataType
        ? ([_, column]) =>
            (column.standardizedVariable === null || column.standardizedVariable === undefined) &&
            column.dataType === dataType
        : ([_, column]) =>
            (column.standardizedVariable === null || column.standardizedVariable === undefined) &&
            (column.dataType === undefined || column.dataType === null)
    );
    labelToDisplay = dataType ? dataType.toLocaleLowerCase() : 'other';
  }

  const handleSelect = () => {
    if (columnsToDisplay.length > 0) {
      // For assessment tool, find the first group and select it
      if (
        standardizedVariable?.identifier ===
        useDataStore.getState().getAssessmentToolConfig().identifier
      ) {
        const groupedColumns: Record<string, ColumnEntry[]> = {};

        columnsToDisplay.forEach(([columnId, column]) => {
          const groupKey = column.isPartOf?.label || 'Ungrouped';
          if (!groupedColumns[groupKey]) {
            groupedColumns[groupKey] = [];
          }
          groupedColumns[groupKey].push([columnId, column]);
        });

        const firstGroupColumns = Object.values(groupedColumns)[0];
        if (firstGroupColumns) {
          onSelect({
            columnIDs: firstGroupColumns.map(([id]) => id),
            dataType,
          });
          return;
        }
      }

      onSelect({
        columnIDs: columnsToDisplay.map(([id]) => id),
        dataType,
      });
    }
  };

  const handleGroupSelect = (groupColumns: ColumnEntry[]) => {
    onSelect({
      columnIDs: groupColumns.map(([id]) => id),
      dataType,
    });
  };

  const handleGroupToggle = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  if (
    standardizedVariable?.identifier ===
    useDataStore.getState().getAssessmentToolConfig().identifier
  ) {
    const groupedColumns: Record<string, ColumnEntry[]> = {};

    columnsToDisplay.forEach(([columnId, column]) => {
      const groupKey = column.isPartOf?.label || 'Ungrouped';
      if (!groupedColumns[groupKey]) {
        groupedColumns[groupKey] = [];
      }
      groupedColumns[groupKey].push([columnId, column]);
    });

    return (
      <div data-cy={`side-column-nav-bar-${labelToDisplay}`}>
        <div className="flex items-center">
          <IconButton
            data-cy={`side-column-nav-bar-${labelToDisplay}-toggle-button`}
            size="small"
            onClick={() => setShowColumns(!showColumns)}
            sx={{
              marginRight: '4px',
              color: 'primary.main',
            }}
          >
            {showColumns ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
          </IconButton>
          <Typography
            data-cy={`side-column-nav-bar-${labelToDisplay}-select-button`}
            onClick={handleSelect}
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontWeight:
                selectedColumnId && columnsToDisplay.some(([id]) => id === selectedColumnId)
                  ? 'bold'
                  : 'normal',
              color:
                selectedColumnId && columnsToDisplay.some(([id]) => id === selectedColumnId)
                  ? 'primary.main'
                  : '',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {labelToDisplay.charAt(0).toUpperCase() + labelToDisplay.slice(1)}
          </Typography>
        </div>
        <Collapse in={showColumns}>
          <List sx={{ pl: 2 }} className="space-y-3">
            {Object.entries(groupedColumns).map(([groupName, groupColumns]) => {
              const isGroupExpanded = expandedGroups[groupName] || false;
              const isGroupSelected = groupColumns.some(([id]) => id === selectedColumnId);

              return (
                <div key={groupName}>
                  <div className="flex items-center">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupToggle(groupName);
                      }}
                      sx={{
                        marginRight: '4px',
                      }}
                    >
                      {isGroupExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    </IconButton>
                    <Typography
                      onClick={() => handleGroupSelect(groupColumns)}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: isGroupSelected ? 'bold' : 'normal',
                        color: isGroupSelected ? 'primary.main' : '',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {groupName}
                    </Typography>
                  </div>
                  <Collapse in={isGroupExpanded}>
                    <List sx={{ pl: 4 }}>
                      {groupColumns.map(([columnId, column]) => (
                        <ListItem
                          data-cy={`side-column-nav-bar-${labelToDisplay}-${column.header}`}
                          key={columnId}
                          sx={{
                            pl: 4,
                            py: 0,
                            color: 'text.secondary',
                            fontWeight: columnId === selectedColumnId ? 'bold' : 'normal',
                          }}
                        >
                          <Typography>{column.header}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </div>
              );
            })}
          </List>
        </Collapse>
      </div>
    );
  }

  return (
    <div data-cy={`side-column-nav-bar-${labelToDisplay}`}>
      <div className="flex items-center">
        <IconButton
          data-cy={`side-column-nav-bar-${labelToDisplay}-toggle-button`}
          size="small"
          onClick={() => setShowColumns(!showColumns)}
          sx={{
            marginRight: '4px',
            color: 'primary.main',
          }}
        >
          {showColumns ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        </IconButton>
        <Typography
          data-cy={`side-column-nav-bar-${labelToDisplay}-select-button`}
          onClick={handleSelect}
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight:
              selectedColumnId && columnsToDisplay.some(([id]) => id === selectedColumnId)
                ? 'bold'
                : 'normal',
            color:
              selectedColumnId && columnsToDisplay.some(([id]) => id === selectedColumnId)
                ? 'primary.main'
                : '',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {labelToDisplay.charAt(0).toUpperCase() + labelToDisplay.slice(1)}
        </Typography>
      </div>
      <Collapse in={showColumns}>
        <List sx={{ pl: 4 }}>
          {columnsToDisplay.map(([columnId, column]) => (
            <ListItem
              data-cy={`side-column-nav-bar-${labelToDisplay}-${column.header}`}
              key={columnId}
              sx={{
                pl: 4,
                py: 0,
                color: 'text.secondary',
                fontWeight: columnId === selectedColumnId ? 'bold' : 'normal',
              }}
            >
              <Typography>{column.header}</Typography>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
}
ColumnTypeCollapse.defaultProps = ColumnTypeCollapseDefaultProps;
