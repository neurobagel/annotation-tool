import { List, ListItem, ListItemText } from '@mui/material';
import { useColumnUpdates } from '../hooks';
import useDataStore from '../stores/data';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';

function ColumnAnnotation() {
  const { columns, standardizedVariables } = useDataStore();

  const { handleDescriptionChange, handleVariableTypeChange, handleStandardizedVariableChange } =
    useColumnUpdates();

  const columnsArray = Object.entries(columns);

  return (
    <div
      className="flex flex-col items-center gap-6 h-[70vh] overflow-auto"
      data-cy="column-annotation-container"
    >
      <div className="w-full max-w-5xl">
        <Instruction className="mb-2">
          <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Provide a clear description for each column to help downstream users." />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    Select the data type: <b>Categorical</b> (finite set of values) or{' '}
                    <b>Continuous</b> (numeric/scale).
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Map the column to a standardized variable when possible to enable harmonization." />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Multi‑column measures will be finalized in the next step." />
            </ListItem>
          </List>
        </Instruction>
      </div>
      {columnsArray.map(([columnId, column]) => (
        <div key={columnId} className="w-full">
          <ColumnAnnotationCard
            id={columnId}
            header={column.header}
            description={column.description || null}
            variableType={column.variableType || null}
            standardizedVariable={column.standardizedVariable || null}
            standardizedVariableOptions={standardizedVariables}
            onDescriptionChange={handleDescriptionChange}
            onDataTypeChange={handleVariableTypeChange}
            onStandardizedVariableChange={handleStandardizedVariableChange}
          />
        </div>
      ))}
    </div>
  );
}
export default ColumnAnnotation;
