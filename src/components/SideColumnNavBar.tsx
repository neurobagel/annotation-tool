import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Typography, Paper, Collapse, Button, List, ListItem, ListItemButton } from '@mui/material';
import { useState } from 'react';
import useDataStore from '~/stores/data';
import { Columns, StandardizedVariable } from '../utils/types';
import { getMappedStandardizedVariables } from '../utils/util';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ExpandableSectionDefaultProps = {
  defaultExpanded: true,
};

function ExpandableSection({ title, children, defaultExpanded = true }: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <>
      <Button
        className="justify-start"
        fullWidth
        onClick={() => setExpanded(!expanded)}
        endIcon={expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        <Typography>{title}</Typography>
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

function ColumnTypeCollapse({
  dataType = null,
  standardizedVariable = null,
  columns,
  onSelect,
  selectedColumnId,
}: ColumnTypeCollapseProps) {
  const [showColumns, setShowColumns] = useState<boolean>(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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
        ? ([_, column]) =>
            (column.standardizedVariable === null || column.standardizedVariable === undefined) &&
            column.dataType === dataType
        : ([_, column]) =>
            (column.standardizedVariable === null || column.standardizedVariable === undefined) &&
            column.dataType === undefined
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

  if (
    standardizedVariable?.identifier ===
    useDataStore.getState().getAssessmentToolConfig().identifier
  ) {
    const groupedColumns: Record<string, Array<[string, any]>> = {};

    columnsToDisplay.forEach(([columnId, column]) => {
      const groupKey = column.isPartOf?.label || 'Ungrouped';
      if (!groupedColumns[groupKey]) {
        groupedColumns[groupKey] = [];
      }
      groupedColumns[groupKey].push([columnId, column]);
    });

    return (
      <div data-cy={`side-column-nav-bar-${labelToDisplay}`}>
        <div className="flex flex-col">
          <Button
            data-cy={`side-column-nav-bar-${labelToDisplay}-select-button`}
            onClick={handleSelect}
            sx={{
              flexGrow: 1,
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'text.primary',
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
          <Button
            className="justify-start"
            variant="text"
            onClick={() => setShowColumns(!showColumns)}
            sx={{
              fontSize: '12px',
              color: 'primary',
            }}
          >
            {showColumns ? 'hide groups' : 'show groups'}
            {showColumns ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </Button>
        </div>
        <Collapse in={showColumns}>
          <List>
            {Object.entries(groupedColumns).map(([groupName, groupColumns]) => {
              const isGroupExpanded = expandedGroups[groupName] || false;

              return (
                <div key={groupName}>
                  <ListItemButton
                    onClick={() =>
                      setExpandedGroups((prev) => ({
                        ...prev,
                        [groupName]: !isGroupExpanded,
                      }))
                    }
                    sx={{ pl: 4 }}
                  >
                    <Typography>{groupName}</Typography>
                    {isGroupExpanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </ListItemButton>
                  <Collapse in={isGroupExpanded}>
                    <List sx={{ pl: 6 }}>
                      {groupColumns.map(([columnId, column]) => (
                        <ListItem
                          data-cy={`side-column-nav-bar-${labelToDisplay}-${column.header}`}
                          key={columnId}
                          sx={{
                            color: 'grey.600',
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
      <div className="flex flex-col">
        <Button
          data-cy={`side-column-nav-bar-${labelToDisplay}-select-button`}
          onClick={handleSelect}
          sx={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: 'text.primary',
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
        <Button
          className="justify-start"
          variant="text"
          onClick={() => setShowColumns(!showColumns)}
          sx={{
            fontSize: '12px',
            color: 'primary',
          }}
        >
          {showColumns ? 'hide columns' : 'show columns'}
          {showColumns ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Button>
      </div>
      <Collapse in={showColumns}>
        <List>
          {columnsToDisplay.map(([columnId, column]) => (
            <ListItem
              data-cy={`side-column-nav-bar-${labelToDisplay}-${column.header}`}
              key={columnId}
              sx={{
                color: 'grey.600',
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

interface SideColumnNavBarProps {
  columns: Columns;
  onSelect: (params: {
    columnIds: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => void;
  selectedColumnId: string | null;
}

function SideColumnNavBar({ columns, onSelect, selectedColumnId }: SideColumnNavBarProps) {
  const mappedStandardizedVariables = getMappedStandardizedVariables(columns);

  return (
    <Paper className="w-full max-w-80 p-4" elevation={3} data-cy="side-column-nav-bar">
      <ExpandableSection title="Annotated">
        <List>
          {mappedStandardizedVariables.map((standardizedVariable) => (
            <ListItemButton sx={{ paddingLeft: 2 }} key={standardizedVariable.identifier}>
              <ColumnTypeCollapse
                dataType={null}
                standardizedVariable={standardizedVariable}
                columns={columns}
                onSelect={onSelect}
                selectedColumnId={selectedColumnId}
              />
            </ListItemButton>
          ))}
        </List>
      </ExpandableSection>

      <ExpandableSection title="Unannotated">
        <List>
          {['Categorical', 'Continuous', null].map((dataType) => (
            <ListItemButton key={`unannotated-${dataType || 'other'}`} sx={{ paddingLeft: 2 }}>
              <ColumnTypeCollapse
                dataType={dataType as 'Categorical' | 'Continuous' | null}
                columns={columns}
                onSelect={onSelect}
                selectedColumnId={selectedColumnId}
              />
            </ListItemButton>
          ))}
        </List>
      </ExpandableSection>
    </Paper>
  );
}

export default SideColumnNavBar;
