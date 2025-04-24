import { List, Paper, ListItemButton } from '@mui/material';
import { Columns } from '../utils/types';
import { getMappedStandardizedVariables } from '../utils/util';
import { ColumnTypeCollapse, ExpandableSection } from './ColumnTypeCollapse';

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
      <ExpandableSection title="annotated">
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

      <ExpandableSection title="unannotated">
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
