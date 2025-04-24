import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Typography, Collapse, Button, List, ListItem, ListItemButton } from '@mui/material';
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
        startIcon={expanded ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
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
    columnIds: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => void;
  selectedColumnId: string | null;
}

const ColumnTypeCollapseDefaultProps = {
  dataType: null,
  standardizedVariable: null,
};

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
      onSelect({
        columnIds: columnsToDisplay.map(([id]) => id),
        dataType,
      });
    }
  };

  const handleGroupSelect = (groupColumns: ColumnEntry[]) => {
    onSelect({
      columnIds: groupColumns.map(([id]) => id),
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
        <div className="flex">
          <Button
            data-cy={`side-column-nav-bar-${labelToDisplay}-toggle-button`}
            variant="text"
            onClick={() => setShowColumns(!showColumns)}
            sx={{
              minWidth: '24px',
              padding: '6px',
              color: 'primary',
            }}
          >
            {showColumns ? (
              <ArrowDropDownIcon fontSize="small" />
            ) : (
              <ArrowRightIcon fontSize="small" />
            )}
          </Button>
          <Button
            data-cy={`side-column-nav-bar-${labelToDisplay}-select-button`}
            onClick={handleSelect}
            sx={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'text.primary',
              paddingLeft: '4px',
            }}
            variant="text"
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
        </div>
        <Collapse in={showColumns}>
          <List className="pl-2">
            {Object.entries(groupedColumns).map(([groupName, groupColumns]) => {
              const isGroupExpanded = expandedGroups[groupName] || false;
              const isGroupSelected = groupColumns.some(([id]) => id === selectedColumnId);

              return (
                <div key={groupName}>
                  <div className="flex">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGroupToggle(groupName);
                      }}
                      sx={{
                        minWidth: '24px',
                        padding: '6px',
                      }}
                    >
                      {isGroupExpanded ? (
                        <ArrowDropDownIcon fontSize="small" />
                      ) : (
                        <ArrowRightIcon fontSize="small" />
                      )}
                    </Button>
                    <ListItemButton
                      onClick={() => handleGroupSelect(groupColumns)}
                      sx={{
                        fontWeight: isGroupSelected ? 'bold' : 'normal',
                        paddingLeft: '4px',
                        minWidth: 0,
                      }}
                    >
                      <Typography>{groupName}</Typography>
                    </ListItemButton>
                  </div>
                  <Collapse in={isGroupExpanded}>
                    <List className="pl-6">
                      {groupColumns.map(([columnId, column]) => (
                        <ListItem
                          data-cy={`side-column-nav-bar-${labelToDisplay}-${column.header}`}
                          key={columnId}
                          sx={{
                            color: 'grey.600',
                            fontWeight: columnId === selectedColumnId ? 'bold' : 'normal',
                            paddingLeft: '32px',
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
      <div className="flex">
        <Button
          variant="text"
          onClick={() => setShowColumns(!showColumns)}
          sx={{
            minWidth: '24px',
            padding: '6px',
            color: 'primary',
          }}
        >
          {showColumns ? (
            <ArrowDropDownIcon fontSize="small" />
          ) : (
            <ArrowRightIcon fontSize="small" />
          )}
        </Button>
        <Button
          data-cy={`side-column-nav-bar-${labelToDisplay}-select-button`}
          onClick={handleSelect}
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            paddingLeft: '4px',
            minWidth: 0,
          }}
          variant="text"
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
      </div>
      <Collapse in={showColumns}>
        <List className="pl-6">
          {columnsToDisplay.map(([columnId, column]) => (
            <ListItem
              data-cy={`side-column-nav-bar-${labelToDisplay}-${column.header}`}
              key={columnId}
              sx={{
                color: 'grey.600',
                fontWeight: columnId === selectedColumnId ? 'bold' : 'normal',
                paddingLeft: '32px',
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
