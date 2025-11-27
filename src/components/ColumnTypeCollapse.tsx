import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Typography, Collapse, List, ListItem, IconButton } from '@mui/material';
import { capitalize } from 'lodash';
import { useMemo, useState } from 'react';
import type { ColumnGroupColumn } from '~/hooks/useValueAnnotationColumns';

interface MultiColumnGroup {
  label: string;
  columns: ColumnGroupColumn[];
}

interface ColumnTypeCollapseProps {
  label: string;
  columns: ColumnGroupColumn[];
  onSelect: (params: {
    columnIDs: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => void;
  selectedColumnId: string | null;
  dataType?: 'Categorical' | 'Continuous' | null;
  isMultiColumnMeasure?: boolean;
  groupedColumns?: MultiColumnGroup[];
}

const ColumnTypeCollapseDefaultProps = {
  dataType: null,
  isMultiColumnMeasure: false,
  groupedColumns: [],
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
function ColumnTypeCollapse({
  label,
  columns,
  onSelect,
  selectedColumnId,
  dataType = null,
  isMultiColumnMeasure = false,
  groupedColumns = [],
}: ColumnTypeCollapseProps) {
  const [showColumns, setShowColumns] = useState<boolean>(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const labelToDisplay = label.toLocaleLowerCase();

  const groupedColumnEntries = useMemo(() => {
    if (!isMultiColumnMeasure) {
      return [];
    }

    if (groupedColumns.length > 0) {
      return groupedColumns;
    }

    const fallbackGroups: Record<string, ColumnGroupColumn[]> = {};
    columns.forEach((entry) => {
      const groupKey =
        typeof entry.column.isPartOf === 'string' && entry.column.isPartOf.length > 0
          ? entry.column.isPartOf
          : 'Ungrouped';

      if (!fallbackGroups[groupKey]) {
        fallbackGroups[groupKey] = [];
      }

      fallbackGroups[groupKey].push(entry);
    });

    return Object.entries(fallbackGroups).map(([groupLabel, groupColumns]) => ({
      label: groupLabel || 'Ungrouped',
      columns: groupColumns,
    }));
  }, [columns, groupedColumns, isMultiColumnMeasure]);

  const handleSelect = () => {
    if (columns.length > 0) {
      if (isMultiColumnMeasure && groupedColumnEntries.length > 0) {
        const firstGroup = groupedColumnEntries[0];
        onSelect({
          columnIDs: firstGroup.columns.map((entry) => entry.id),
          dataType,
        });
        return;
      }

      onSelect({
        columnIDs: columns.map((entry) => entry.id),
        dataType,
      });
    }
  };

  const handleGroupSelect = (groupColumns: ColumnGroupColumn[]) => {
    onSelect({
      columnIDs: groupColumns.map((entry) => entry.id),
      dataType,
    });
  };

  const handleGroupToggle = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  if (isMultiColumnMeasure) {
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
                selectedColumnId && columns.some((entry) => entry.id === selectedColumnId)
                  ? 'bold'
                  : 'normal',
              color:
                selectedColumnId && columns.some((entry) => entry.id === selectedColumnId)
                  ? 'primary.main'
                  : '',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {capitalize(labelToDisplay)}
          </Typography>
        </div>
        <Collapse in={showColumns}>
          <List sx={{ pl: 2 }} className="space-y-3">
            {groupedColumnEntries.map(({ label: groupName, columns: groupColumns }) => {
              const isGroupExpanded = expandedGroups[groupName] || false;
              const isGroupSelected = groupColumns.some((entry) => entry.id === selectedColumnId);

              return (
                <div key={`${labelToDisplay}-${groupName}`}>
                  <div className="flex items-center">
                    <IconButton
                      data-cy={`side-column-nav-bar-${labelToDisplay}-${groupName}-toggle-button`}
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
                      data-cy={`side-column-nav-bar-${labelToDisplay}-${groupName}`}
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
                      {groupColumns.map((entry) => (
                        <ListItem
                          data-cy={`side-column-nav-bar-${labelToDisplay}-${groupName}-${entry.column.name}`}
                          key={entry.id}
                          sx={{
                            pl: 4,
                            py: 0,
                            color: 'text.secondary',
                            fontWeight: entry.id === selectedColumnId ? 'bold' : 'normal',
                          }}
                        >
                          <Typography>{entry.column.name || entry.id}</Typography>
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
              selectedColumnId && columns.some((entry) => entry.id === selectedColumnId)
                ? 'bold'
                : 'normal',
            color:
              selectedColumnId && columns.some((entry) => entry.id === selectedColumnId)
                ? 'primary.main'
                : '',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {capitalize(labelToDisplay)}
        </Typography>
      </div>
      <Collapse in={showColumns}>
        <List sx={{ pl: 4 }}>
          {columns.map((entry) => (
            <ListItem
              data-cy={`side-column-nav-bar-${labelToDisplay}-${entry.column.name}`}
              key={entry.id}
              sx={{
                pl: 4,
                py: 0,
                color: 'text.secondary',
                fontWeight: entry.id === selectedColumnId ? 'bold' : 'normal',
              }}
            >
              <Typography>{entry.column.name || entry.id}</Typography>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
}
ColumnTypeCollapse.defaultProps = ColumnTypeCollapseDefaultProps;

export default ColumnTypeCollapse;
