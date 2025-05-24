import { List, Paper, ListItem } from '@mui/material';
import useDataStore from '~/stores/data';
import { Columns } from '../utils/types';
import { ColumnTypeCollapse, ExpandableSection } from './ColumnTypeCollapse';

interface SideColumnNavBarProps {
  columns: Columns;
  onSelect: (params: {
    columnIDs: string[];
    dataType?: 'Categorical' | 'Continuous' | null;
  }) => void;
  selectedColumnId: string | null;
}

function SideColumnNavBar({ columns, onSelect, selectedColumnId }: SideColumnNavBarProps) {
  const mappedStandardizedVariables = useDataStore.getState().getMappedStandardizedVariables();

  return (
    <Paper className="w-full max-w-80 p-4" elevation={3} data-cy="side-column-nav-bar">
      <ExpandableSection title="annotated">
        <List>
          {mappedStandardizedVariables.map((standardizedVariable) => (
            <ListItem key={standardizedVariable.identifier} sx={{ paddingLeft: 2 }}>
              <ColumnTypeCollapse
                dataType={null}
                standardizedVariable={standardizedVariable}
                columns={columns}
                onSelect={onSelect}
                selectedColumnId={selectedColumnId}
              />
            </ListItem>
          ))}
        </List>
      </ExpandableSection>

      <ExpandableSection title="unannotated">
        <List>
          {['Categorical', 'Continuous', null].map((dataType) => (
            <ListItem key={`unannotated-${dataType || 'other'}`} sx={{ paddingLeft: 2 }}>
              <ColumnTypeCollapse
                dataType={dataType as 'Categorical' | 'Continuous' | null}
                columns={columns}
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
