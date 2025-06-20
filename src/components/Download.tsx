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
import { useState, useMemo } from 'react';
import emoji from '../assets/download-emoji.png';
import schema from '../assets/neurobagel_data_dictionary.schema.json';
import useDataStore from '../stores/data';
import useViewStore from '../stores/view';
import { DataDictionary, View } from '../utils/types';
import DataDictionaryPreview from './DataDictionaryPreview';

function Download() {
  const [dictionaryCollapsed, setDictionaryCollapsed] = useState(false);
  const [forceAllowDownload, setForceAllowDownload] = useState(false);

  const uploadedDataTableFileName = useDataStore((state) => state.uploadedDataTableFileName);
  const columns = useDataStore((state) => state.columns);
  const config = useDataStore((state) => state.config);
  const reset = useDataStore((state) => state.reset);

  const setCurrentView = useViewStore((state) => state.setCurrentView);

  const dataDictionary = useMemo(
    () =>
      Object.entries(columns).reduce((dictAcc, [_columnKey, column]) => {
        if (column.header) {
          const dictionaryEntry: DataDictionary[string] = {
            Description: column.description || '',
          };

          // Description of levels always included for the BIDS section
          if (column.dataType === 'Categorical' && column.levels) {
            dictionaryEntry.Levels = Object.entries(column.levels).reduce(
              (levelsObj, [levelKey, levelValue]) => ({
                ...levelsObj,
                [levelKey]: {
                  Description: levelValue.description || '',
                },
              }),
              {} as { [key: string]: { Description: string } }
            );
          }

          if (column.dataType === 'Continuous' && column.units !== undefined) {
            dictionaryEntry.Units = column.units;
          }

          if (column.standardizedVariable) {
            dictionaryEntry.Annotations = {
              IsAbout: {
                TermURL: column.standardizedVariable.identifier,
                Label: column.standardizedVariable.label,
              },
            };

            // Add term url to Levels under BIDS section only for a categorical column with a standardized variable
            if (column.dataType === 'Categorical' && column.levels) {
              dictionaryEntry.Levels = Object.entries(column.levels).reduce(
                (updatedLevels, [levelKey, levelValue]) => ({
                  ...updatedLevels,
                  [levelKey]: {
                    ...updatedLevels[levelKey],
                    ...(levelValue.termURL ? { TermURL: levelValue.termURL } : {}),
                  },
                }),
                dictionaryEntry.Levels || {}
              );

              dictionaryEntry.Annotations.Levels = Object.entries(column.levels).reduce(
                (termsObj, [levelKey, levelValue]) => ({
                  ...termsObj,
                  [levelKey]: {
                    TermURL: levelValue.termURL || '',
                    Label: levelValue.label || '',
                  },
                }),
                {} as { [key: string]: { TermURL: string; Label: string } }
              );
            }

            const configEntry = Object.values(config).find(
              (configItem) => configItem.identifier === column.standardizedVariable?.identifier
            );
            if (configEntry?.identifies) {
              dictionaryEntry.Annotations.Identifies = configEntry.identifies;
            }

            if (column.isPartOf?.termURL && column.isPartOf?.label) {
              dictionaryEntry.Annotations.IsPartOf = {
                TermURL: column.isPartOf.termURL,
                Label: column.isPartOf.label,
              };
            }

            if (column.missingValues && column.dataType !== null) {
              dictionaryEntry.Annotations.MissingValues = column.missingValues;
            }

            if (column.dataType === 'Continuous' && column.format) {
              dictionaryEntry.Annotations.Format = {
                TermURL: column.format?.termURL || '',
                Label: column.format?.label || '',
              };
            }
          }

          return {
            ...dictAcc,
            [column.header]: dictionaryEntry,
          };
        }
        return dictAcc;
      }, {} as DataDictionary),
    [columns, config]
  );

  const { isValid: schemaValid, errors: schemaErrors } = useMemo(() => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const isValid = validate(dataDictionary);

    if (!isValid) {
      /*
      Since Ajv uses JSON Pointer format for instance path
      we need to slice the leading slash off of the instance path
      */
      const errors =
        validate.errors?.map((error) => {
          const pathSegments = error.instancePath.slice(1).split('/');
          return pathSegments[0];
        }) || [];

      const uniqueErrors = Array.from(new Set(errors));

      return { isValid: false, errors: uniqueErrors };
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
    a.download = `${uploadedDataTableFileName?.slice(0, -4)}_annotated.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleAnnotatingNewDataset = () => {
    reset();
    setCurrentView(View.Upload);
  };

  return (
    <div className="flex flex-col items-center p-6" data-cy="download">
      {schemaValid ? (
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
      ) : (
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
            The following columns have incomplete value annotations:
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
            annotations, the data dictionary will not work as-is with other Neurobagel tools.
            However, you can download and re-upload the partially annotation .json to complete
            annotations later, if desired.
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
          data-cy="datadictionary-toggle-preview-button"
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

        <Typography variant="h6" className="font-bold mt-4">
          Here are some next steps:
        </Typography>
        <List className="list-disc pl-6" data-cy="datadictionary-next-steps-list">
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
        {!schemaValid ? (
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
        ) : null}

        <Button
          data-cy="download-datadictionary-button"
          variant="contained"
          color={schemaValid ? 'success' : 'error'}
          disabled={!schemaValid && !forceAllowDownload}
          onClick={handleDownload}
        >
          Download Data Dictionary
        </Button>
      </div>

      <Button
        data-cy="annotate-new-dataset-button"
        variant="contained"
        color="info"
        onClick={handleAnnotatingNewDataset}
        className="mt-4"
      >
        Annotate a new dataset
      </Button>
    </div>
  );
}

export default Download;
