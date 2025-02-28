import { useState, useMemo } from 'react';
import {
  Button,
  Alert,
  Collapse,
  Typography,
  List,
  ListItem,
  Switch,
  FormControlLabel,
  Link,
} from '@mui/material';
import Ajv from 'ajv';
import NavigationButton from './NavigationButton';
import DataDictionaryPreview from './DataDictionaryPreview';
import useDataStore from '../stores/data';
import schema from '../assets/neurobagel_data_dictionary.schema.json';
import { DataDictionary } from '../utils/types';
import emoji from '../assets/download-emoji.png';

function Download() {
  const [dictionaryCollapsed, setDictionaryCollapsed] = useState(false);
  const [forceAllowDownload, setForceAllowDownload] = useState(false);

  const uploadedDataTableFileName = useDataStore((state) => state.uploadedDataTableFileName);

  const columns = useDataStore((state) => state.columns);

  const dataDictionary = useMemo(
    () =>
      Object.entries(columns).reduce((acc, [_, column]) => {
        if (column.header) {
          acc[column.header] = {
            Description: column.description || '',
          };
        }
        return acc;
      }, {} as DataDictionary),
    [columns]
  );

  const { isValid: schemaValid, errors: schemaErrors } = useMemo(() => {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid = validate(dataDictionary);

    if (!isValid) {
      const errors = validate.errors?.map((error) => error.instancePath.slice(1)) || [];
      return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
  }, [dataDictionary]);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(dataDictionary, null, 2)], {
      type: 'application/json;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadedDataTableFileName}_annotated.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center p-6" data-cy="download">
      <Typography variant="h4" className="mb-6 font-bold">
        Download
      </Typography>

      {!schemaValid && (
        <Alert
          severity="error"
          data-cy="incomplete-annotations-alert"
          className="mb-6 w-full max-w-2xl"
        >
          <Typography variant="h6" className="mb-2 font-bold">
            Incomplete Annotations
          </Typography>
          <Typography variant="body1" className="mb-2">
            There are incomplete annotations for columns that were mapped to variables. You can go
            back and complete these annotations before you download the .json data dictionary.
          </Typography>
          <Typography variant="body1" className="mb-2">
            The following columns have incomplete annotations:
          </Typography>
          <List className="list-disc pl-6" data-cy="incomplete-annotations-list">
            {schemaErrors.map((column) => (
              <ListItem key={column} className="list-item">
                <Typography variant="body1">{column}</Typography>
              </ListItem>
            ))}
          </List>
          <Typography variant="body1" className="mb-2">
            <b>NOTE</b>: If you download the .json data dictionary without completing the
            annotations, the data dictionary will not work with subsequent neurobagel steps.
          </Typography>
          <Typography variant="body1" className="mb-2">
            <b>
              You will not be able to load the data dictionary into the annotation tool to change
              mistakes later.
            </b>
          </Typography>
        </Alert>
      )}

      {schemaValid && (
        <Alert
          data-cy="complete-annotations-alert"
          severity="success"
          className="mb-6 w-full max-w-2xl"
        >
          <div className="flex items-center gap-2">
            <img src={emoji} alt="bagel confetti" className="h-10 w-10" />
            <Typography variant="h4" className="font-bold">
              Congratulations!
            </Typography>
          </div>
          <Typography variant="body1">
            You have successfully created a{' '}
            <Link
              href="https://neurobagel.org/data_models/dictionaries/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              neurobagel annotated .json data dictionary
            </Link>
            .
          </Typography>
        </Alert>
      )}

      <div className="w-full max-w-2xl">
        <Typography variant="h5" className="mb-2 font-bold">
          Data Dictionary
        </Typography>
        <Typography variant="body1" className="mb-4">
          Here is the final .json data dictionary that you have created:
        </Typography>

        <Button
          data-cy="data-dictionary-toggle-preview-button"
          variant="outlined"
          size="small"
          onClick={() => setDictionaryCollapsed(!dictionaryCollapsed)}
          className="mb-4"
        >
          {dictionaryCollapsed ? 'Show' : 'Hide'} Data Dictionary
        </Button>

        <Collapse in={!dictionaryCollapsed}>
          <DataDictionaryPreview dataDictionary={dataDictionary} />
        </Collapse>

        <Typography variant="h6" className="font-bold">
          Here are some next steps:
        </Typography>
        <List className="list-disc pl-6" data-cy="data-dictionary-next-steps-list">
          <ListItem className="list-item">
            <Typography variant="body1">
              Download the .json data dictionary to your local hard drive by clicking the green
              &quot;Download&quot; button.
            </Typography>
          </ListItem>
          <ListItem className="list-item">
            <Typography variant="body1">
              Use the .json data dictionary to{' '}
              <Link
                href="https://neurobagel.org/user_guide/cli/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                create a harmonized view of your data
              </Link>
              .
            </Typography>
          </ListItem>
          <ListItem className="list-item">
            <Typography variant="body1">
              Learn more about{' '}
              <Link
                href="https://neurobagel.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                neurobagel
              </Link>{' '}
              and how to use harmonized data for cross-dataset search.
            </Typography>
          </ListItem>
        </List>
      </div>

      <div className="flex flex-col items-center">
        {!schemaValid && (
          <FormControlLabel
            control={
              <Switch
                data-cy="force-download-switch"
                checked={forceAllowDownload}
                onChange={(e) => setForceAllowDownload(e.target.checked)}
              />
            }
            label="Let me download, I know what I'm doing!"
          />
        )}

        <Button
          data-cy="download-data-dictionary-button"
          variant="contained"
          color={schemaValid ? 'success' : 'error'}
          disabled={!schemaValid && !forceAllowDownload}
          onClick={handleDownload}
        >
          Download Data Dictionary
        </Button>
      </div>

      <div className="mt-6">
        <NavigationButton label="Back - Value Annotation" viewToNavigateTo="valueAnnotation" />
      </div>
    </div>
  );
}

export default Download;
