import { List, ListItem, ListItemText } from '@mui/material';

export function UploadInstructions() {
  return (
    <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={<>Here you load the tabular data, that you want to annotate, into the app.</>}
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>[required]</strong> Upload a tabular phenotypic <code>.tsv</code> file.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>[optional]</strong> Upload a data dictionary for your tabular file to give you
              more context during the annotation. This could be a BIDS data dictionary or a data
              dictionary you have generated in a previous session with the Neurobagel annotator.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              When you have uploaded your files, you can look at a preview to check that all looks
              good. And then you can navigate to the next step.
            </>
          }
        />
      </ListItem>
    </List>
  );
}

export function MultiColumnMeasuresInstructions() {
  return (
    <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="On the right side you see all the columns you have previously mapped to the special “Multi-column measure” standardized variable." />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="Your task is now to create “Collection” for each of the measures these columns belong to, and to then map the columns to their correct “Collection”." />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              Click the big (<strong>+</strong>) plus icon to start a new &quot;Collection&quot;
              card and choose the name of the measure you want to create.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="On each card, select the columns that belong to this measure from the dropdown." />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="As you map columns to measure “Collection”, they will turn grey in the list overview on the right. It is likely that you will not be able to find the right measure for every column." />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="Before you proceed to the next step, make sure to remove any columns you were not able to map to a measure by clicking the (×) symbol next to the column name." />
      </ListItem>
    </List>
  );
}

export function ColumnAnnotationInstructions() {
  return (
    <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="On this page you provide more information on each column in your phenotypic table." />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Provide a text description</strong> to explain to others what information is
              in the column. To add a description, just type in the &quot;Description&quot; field.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Map the column to a standardized variable</strong>. This step allows us to
              later harmonize your data with that of other users of the tool. To map the column,
              select the variable that matches the content of the column from the dropdown.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Manually set the data type</strong> (categorical or continuous) of the column.
              If you have not mapped the column to a standardized variable, you can manually set the
              data type by clicking the corresponding button on the column card. This will allow you
              to provide additional descriptions for the values in this column later.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Note:</strong> &quot;Assessment tool&quot; is a special standardized variable
              that is meant for any column that is about an Assessment (e.g. a Questionnaire or a
              Task). That means you will likely map many columns to &quot;Assessment tool&quot;,
              even if they represent different assessments. You will be able to map these columns to
              specific assessments in a later step.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              It is likely that you will not find a fitting standardized variable for every column
              in your table. In this case, just consider adding a description for this column to
              provide human readable context on its contents.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="When you have reviewed all columns, you can move on to the next step." />
      </ListItem>
    </List>
  );
}

export function ValueAnnotationInstructions() {
  return (
    <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="On this page, you describe the values in the columns that you have annotated in an earlier step. On the left side you see an overview of columns organized by the standardized variables you have mapped them to." />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              In the <strong>Annotated</strong> section: columns you have mapped to a standardized
              variable.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              In the <strong>Unannotated</strong> section: columns not mapped to a standardized
              variable.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Note:</strong> The &quot;Other&quot; subsection in the &quot;Unannotated&quot;
              section lists any columns that you have neither mapped to a standardized variable, nor
              selected a data type for. You cannot annotate the values of these columns. Go back to
              the Column Annotation page to change this.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              To begin annotating, in the navigation section on the left, click on a standardized
              variable (&quot;Annotated&quot; section), or on a data type (&quot;Unannotated&quot;
              section). On the right side, the corresponding value annotation view opens.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              Column tabs: Every column that is mapped to the current standardized variable has its
              own tab in the value annotation view. Switch between columns by clicking on their tab
              to annotate all values.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="Value: An overview of the unique values in the active column. This is what you are annotating." />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Missing Value:</strong> Click the &quot;Mark as missing&quot; button if the
              &quot;Value&quot; in this row represents a non-response or a missing response (e.g.
              the &quot;Value&quot; is empty, or -999 or similar). If you are annotating a
              categorical standardized variable, i.e. you have a &quot;Standardized Term&quot;
              field, but you cannot find a good match in the term dropdown for your
              &quot;Value&quot;, then also mark this row as missing.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Standardized Term</strong> (categorical variables only): Select the term from
              the dropdown that most closely matches the &quot;Value&quot; in this row. This will
              later allow us to harmonize your dataset. If you cannot find a good match, mark the
              value as missing instead.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Description</strong> (categorical variables only): Write a human readable
              description of what this value encodes or means.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Format</strong> (continuous variables only): Select the format that matches
              your &quot;Values&quot;. Refer to the examples.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText
          primary={
            <>
              <strong>Units</strong> (continuous variables only): Write a human readable description
              of the unit that your &quot;Values&quot; are encoded as. E.g. years, days, etc.
            </>
          }
        />
      </ListItem>
      <ListItem sx={{ display: 'list-item' }}>
        <ListItemText primary="Once you have annotated the values of all columns, you can move on to the final step." />
      </ListItem>
    </List>
  );
}
