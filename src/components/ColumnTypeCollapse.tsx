import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {
  Typography,
  Collapse,
  List,
  ListItem,
  IconButton,
  SvgIcon,
  type SvgIconProps,
} from '@mui/material';
import { capitalize } from 'lodash';
import { useMemo, useState } from 'react';
import type { ColumnGroupColumn } from '~/hooks/useValueAnnotationColumns';

function IncompleteArcIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M12 3A9 9 0 1 1 3 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </SvgIcon>
  );
}

interface CollectionGroup {
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
  isCollection?: boolean;
  groupedColumns?: CollectionGroup[];
  schemaErrors: string[];
}

const ColumnTypeCollapseDefaultProps = {
  dataType: null,
  isCollection: false,
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
  isCollection = false,
  groupedColumns = [],
  schemaErrors,
}: ColumnTypeCollapseProps) {
  const [showColumns, setShowColumns] = useState<boolean>(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const labelToDisplay = label.toLocaleLowerCase();

  const columnCompleteness = useMemo(
    () =>
      Object.fromEntries(
        columns.map((entry) => {
          // The schema uses column.name as the key in the data dictionary.
          // If it's missing, it falls back to the internal column ID.
          const dictionaryKey = entry.column.name || entry.id;
          // The column is assumed annotated if it does not appear in the schema errors.
          return [entry.id, !schemaErrors.includes(dictionaryKey)];
        })
      ),
    [columns, schemaErrors]
  );

  const isCategoryComplete = useMemo(
    () => columns.every((entry) => columnCompleteness[entry.id]),
    [columns, columnCompleteness]
  );

  const groupedColumnEntries = useMemo(() => {
    if (!isCollection) {
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
  }, [columns, groupedColumns, isCollection]);

  const groupCompleteness = useMemo(
    () =>
      Object.fromEntries(
        groupedColumnEntries.map((group) => [
          group.label,
          group.columns.every((entry) => columnCompleteness[entry.id]),
        ])
      ),
    [groupedColumnEntries, columnCompleteness]
  );

  const handleSelect = () => {
    if (columns.length > 0) {
      if (isCollection && groupedColumnEntries.length > 0) {
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

  if (isCollection) {
    return (
      <div className="w-full" data-cy={`side-column-nav-bar-${labelToDisplay}`}>
        <div className="flex items-center hover:bg-gray-50 transition-colors duration-150 py-1">
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
          <div className="flex items-center justify-between flex-grow pr-2">
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
            {isCategoryComplete ? (
              <CheckRoundedIcon
                data-cy={`category-complete-icon-${labelToDisplay}`}
                sx={{ fontSize: 18, color: 'success.main', ml: 1 }}
              />
            ) : (
              <IncompleteArcIcon
                data-cy={`category-incomplete-icon-${labelToDisplay}`}
                sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.6, ml: 1 }}
              />
            )}
          </div>
        </div>
        <Collapse in={showColumns}>
          <List sx={{ pl: 2 }} className="space-y-3">
            {groupedColumnEntries.map(({ label: groupName, columns: groupColumns }) => {
              const isGroupExpanded = expandedGroups[groupName] || false;
              const isGroupSelected = groupColumns.some((entry) => entry.id === selectedColumnId);

              return (
                <div key={`${labelToDisplay}-${groupName}`}>
                  <div className="flex items-center hover:bg-gray-50 transition-colors duration-150 py-0.5">
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
                    <div className="flex items-center justify-between flex-grow pr-2">
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
                      {groupCompleteness[groupName] ? (
                        <CheckRoundedIcon
                          data-cy={`group-complete-icon-${groupName}`}
                          sx={{ fontSize: 16, color: 'success.main', ml: 1 }}
                        />
                      ) : (
                        <IncompleteArcIcon
                          data-cy={`group-incomplete-icon-${groupName}`}
                          sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.6, ml: 1 }}
                        />
                      )}
                    </div>
                  </div>
                  <Collapse in={isGroupExpanded}>
                    <List sx={{ pl: 4 }}>
                      {groupColumns.map((entry) => {
                        const isComplete = columnCompleteness[entry.id] ?? false;
                        return (
                          <ListItem
                            data-cy={`side-column-nav-bar-${labelToDisplay}-${groupName}-${entry.column.name}`}
                            key={entry.id}
                            divider
                            sx={{
                              pl: 4,
                              py: 1,
                              pr: 1, // Add right padding to match parent
                              color: 'text.secondary',
                              fontWeight: entry.id === selectedColumnId ? 'bold' : 'normal',
                              '&:hover': { backgroundColor: 'action.hover' },
                            }}
                          >
                            <Typography sx={{ flexGrow: 1, fontSize: '0.9rem' }}>
                              {entry.column.name || entry.id}
                            </Typography>
                            {isComplete ? (
                              <CheckRoundedIcon
                                data-cy={`column-complete-icon-${entry.id}`}
                                sx={{ fontSize: 14, color: 'success.main', ml: 1 }}
                              />
                            ) : (
                              <IncompleteArcIcon
                                data-cy={`column-incomplete-icon-${entry.id}`}
                                sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.6, ml: 1 }}
                              />
                            )}
                          </ListItem>
                        );
                      })}
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
    <div className="w-full" data-cy={`side-column-nav-bar-${labelToDisplay}`}>
      <div className="flex items-center hover:bg-gray-50 transition-colors duration-150 py-1">
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
        <div className="flex items-center justify-between flex-grow pr-2">
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
          {isCategoryComplete ? (
            <CheckRoundedIcon
              data-cy={`category-complete-icon-${labelToDisplay}`}
              sx={{ fontSize: 18, color: 'success.main', ml: 1 }}
            />
          ) : (
            <IncompleteArcIcon
              data-cy={`category-incomplete-icon-${labelToDisplay}`}
              sx={{ fontSize: 18, color: 'text.secondary', opacity: 0.6, ml: 1 }}
            />
          )}
        </div>
      </div>
      <Collapse in={showColumns}>
        <List sx={{ pl: 4 }}>
          {columns.map((entry) => {
            const isComplete = columnCompleteness[entry.id] ?? false;
            return (
              <ListItem
                data-cy={`side-column-nav-bar-${labelToDisplay}-${entry.column.name}`}
                key={entry.id}
                divider
                sx={{
                  pl: 4,
                  py: 1,
                  pr: 1, // Add right padding to match parent
                  color: 'text.secondary',
                  fontWeight: entry.id === selectedColumnId ? 'bold' : 'normal',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <Typography sx={{ flexGrow: 1, fontSize: '0.9rem' }}>
                  {entry.column.name || entry.id}
                </Typography>
                {isComplete ? (
                  <CheckRoundedIcon
                    data-cy={`column-complete-icon-${entry.id}`}
                    sx={{ fontSize: 16, color: 'success.main', ml: 1 }}
                  />
                ) : (
                  <IncompleteArcIcon
                    data-cy={`column-incomplete-icon-${entry.id}`}
                    sx={{ fontSize: 16, color: 'text.secondary', opacity: 0.6, ml: 1 }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </div>
  );
}
ColumnTypeCollapse.defaultProps = ColumnTypeCollapseDefaultProps;

export default ColumnTypeCollapse;
