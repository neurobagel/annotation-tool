import {
  List,
  Paper,
  ListItem,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useState } from 'react';
import type { UnannotatedColumnGroup } from '~/hooks/useValueAnnotationColumns';
import type {
  ValueAnnotationNavAnnotatedGroup,
  ValueAnnotationNavData,
} from '~/hooks/useValueAnnotationNavData';
import { DataType } from '../utils/internal_types';
import ColumnTypeCollapse from './ColumnTypeCollapse';
import ExpandableSection from './ExpandableSection';

interface SideColumnNavBarProps extends ValueAnnotationNavData {
  onSelect: (params: {
    columnIDs: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => void;
  selectedColumnId: string | null;
}

function AnnotatedColumnGroupCollapse({
  group,
  onSelect,
  selectedColumnId,
}: {
  group: ValueAnnotationNavAnnotatedGroup;
  onSelect: SideColumnNavBarProps['onSelect'];
  selectedColumnId: string | null;
}) {
  return (
    <ColumnTypeCollapse
      label={group.label}
      dataType={null}
      columns={group.columns}
      onSelect={onSelect}
      selectedColumnId={selectedColumnId}
      isMultiColumnMeasure={group.isMultiColumnMeasure}
      groupedColumns={group.groupedColumns}
    />
  );
}

function UnannotatedColumnGroupCollapse({
  group,
  onSelect,
  selectedColumnId,
}: {
  group: UnannotatedColumnGroup;
  onSelect: SideColumnNavBarProps['onSelect'];
  selectedColumnId: string | null;
}) {
  let label = 'other';
  let dataType: 'Categorical' | 'Continuous' | null = null;
  if (group.key === DataType.categorical || group.key === DataType.continuous) {
    dataType = group.key;
    label = group.key.toLocaleLowerCase();
  }

  return (
    <ColumnTypeCollapse
      label={label}
      dataType={dataType}
      columns={group.columns}
      onSelect={onSelect}
      selectedColumnId={selectedColumnId}
    />
  );
}

function SideColumnNavBar({
  annotatedGroups,
  unannotatedGroups,
  onSelect,
  selectedColumnId,
}: SideColumnNavBarProps) {
  const [visibilityFilter, setVisibilityFilter] = useState<'unannotated' | 'annotated' | 'all'>(
    'unannotated'
  );

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: 'unannotated' | 'annotated' | 'all' | null
  ) => {
    if (newFilter !== null) {
      setVisibilityFilter(newFilter);
    }
  };

  // Calculate counts based on groups
  const annotatedCount = annotatedGroups.length;
  const remainingCount = unannotatedGroups.length;

  return (
    <Paper
      className="w-full max-w-80 p-4 flex flex-col max-h-full"
      elevation={3}
      data-cy="side-column-nav-bar"
    >
      <Box className="flex flex-col mb-4 shrink-0">
        <Typography variant="body2" color="text.secondary" className="mb-2 font-medium">
          {remainingCount} groups remaining | {annotatedCount} annotated
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={visibilityFilter}
          exclusive
          onChange={handleFilterChange}
          aria-label="Visibility Filter"
          size="small"
          className="w-full bg-white"
        >
          <ToggleButton value="unannotated" className="flex-1 text-xs font-semibold py-1">
            Unannotated
          </ToggleButton>
          <ToggleButton value="annotated" className="flex-1 text-xs font-semibold py-1">
            Annotated
          </ToggleButton>
          <ToggleButton value="all" className="flex-1 text-xs font-semibold py-1">
            Show All
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <div className="overflow-y-auto flex-1">
        {(visibilityFilter === 'annotated' || visibilityFilter === 'all') && (
          <ExpandableSection
            title="annotated"
            defaultExpanded={visibilityFilter === 'annotated' || visibilityFilter === 'all'}
          >
            <List>
              {annotatedGroups.map((group) => (
                <ListItem key={group.standardizedVariableId} sx={{ paddingLeft: 2 }}>
                  <AnnotatedColumnGroupCollapse
                    group={group}
                    selectedColumnId={selectedColumnId}
                    onSelect={onSelect}
                  />
                </ListItem>
              ))}
            </List>
          </ExpandableSection>
        )}

        {(visibilityFilter === 'unannotated' || visibilityFilter === 'all') && (
          <ExpandableSection
            title="unannotated"
            defaultExpanded={visibilityFilter === 'unannotated' || visibilityFilter === 'all'}
          >
            <List>
              {unannotatedGroups.map((group) => (
                <ListItem key={`unannotated-${group.key}`} sx={{ paddingLeft: 2 }}>
                  <UnannotatedColumnGroupCollapse
                    group={group}
                    onSelect={onSelect}
                    selectedColumnId={selectedColumnId}
                  />
                </ListItem>
              ))}
            </List>
          </ExpandableSection>
        )}
      </div>
    </Paper>
  );
}

export default SideColumnNavBar;
