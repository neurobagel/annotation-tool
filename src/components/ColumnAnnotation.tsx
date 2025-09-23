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
        <Instruction title="Column Annotation" className="mb-2">
          <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="On this page you provide more information on each column in your phenotypic table." />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    <strong>Provide a text description</strong> to explain to others what
                    information is in the column. To add a description, just type in the
                    “Description” field.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    <strong>Map the column to a standardized variable</strong>. This step allows us
                    to later harmonize your data with that of other users of the tool. To map the
                    column, select the variable that matches the content of the column from the
                    dropdown.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    <strong>Manually set the data type</strong> (categorical or continuous) of the
                    column. If you have not mapped the column to a standardized variable, you can
                    manually set the data type by clicking the corresponding button on the column
                    card. This will allow you to provide additional descriptions for the values in
                    this column later.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    <strong>Note:</strong> “Assessment tool” is a special standardized variable that
                    is meant for any column that is about an Assessment (e.g. a Questionnaire or a
                    Task). That means you will likely map many columns to “Assessment tool”, even if
                    they represent different assessments. You will be able to map these columns to
                    specific assessments in a later step.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    It is likely that you will not find a fitting standardized variable for every
                    column in your table. In this case, just consider adding a description for this
                    column to provide human readable context on its contents.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="When you have reviewed all columns, you can move on to the next step." />
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
