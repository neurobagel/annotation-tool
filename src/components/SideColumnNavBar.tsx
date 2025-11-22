import { List, Paper, ListItem } from '@mui/material';
import type { UnannotatedColumnGroup } from '~/hooks/useValueAnnotationColumns';
import type {
  ValueAnnotationNavAnnotatedGroup,
  ValueAnnotationNavData,
} from '~/hooks/useValueAnnotationNavData';
import { DataType } from '../../datamodel';
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
  return (
    <Paper
      className="w-full max-w-80 p-4 overflow-y-auto"
      elevation={3}
      data-cy="side-column-nav-bar"
    >
      <ExpandableSection title="annotated">
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

      <ExpandableSection title="unannotated" defaultExpanded={false}>
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
    </Paper>
  );
}

export default SideColumnNavBar;
