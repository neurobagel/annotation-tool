import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
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
  Divider,
} from '@mui/material';
import { useState } from 'react';
import emoji from '../assets/download-emoji.png';
import { useGenerateDataDictionary } from '../hooks/useGenerateDataDictionary';
import { useSchemaValidation } from '../hooks/useSchemaValidation';
import { useDataActions, useUploadedDataTableFileName, useConfig } from '../stores/data';
import useViewStore from '../stores/view';
import { View } from '../utils/internal_types';
import DataDictionaryPreview from './DataDictionaryPreview';
import GoogleDriveUpload from './GoogleDriveUpload';

function Download() {
  const [dictionaryCollapsed, setDictionaryCollapsed] = useState(false);
  const [forceAllowDownload, setForceAllowDownload] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const uploadedDataTableFileName = useUploadedDataTableFileName();
  const config = useConfig();
  const { reset } = useDataActions();
  const setCurrentView = useViewStore((state) => state.setCurrentView);

  const dataDictionary = useGenerateDataDictionary();
  const { schemaValid, schemaErrors } = useSchemaValidation(dataDictionary);

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
          severity="warning"
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

      <div className="flex w-full flex-col items-center">
        {/* ENIGMA-PD Specific Upload Section */}
        {config === 'ENIGMA-PD' && (
          <>
            <Divider className="my-6 w-full max-w-2xl" />
            <div
              className="my-2 flex w-full max-w-2xl flex-col items-center"
              data-cy="upload-section"
            >
              <Typography
                variant="h5"
                className="mb-2 w-full font-bold"
                data-cy="upload-section-header"
              >
                Upload this data dictionary to drive
              </Typography>
              <Alert
                severity="info"
                className="mb-2 w-full"
                variant="filled"
                data-cy="upload-info-alert"
                sx={{
                  bgcolor: '#e5f6fd', // light cyan background
                  borderLeft: '4px solid #0288d1', // info blue border
                  color: 'rgba(0, 0, 0, 0.87)', // dark test for readability
                  '& .MuiAlert-icon': {
                    color: '#0288d1',
                  },
                }}
              >
                <Typography variant="subtitle2">
                  Only the data dictionary will be uploaded to the ENIGMA-PD community drive
                </Typography>
                <Typography variant="subtitle2">
                  Refer to the &quot;Data Dictionary&quot; preview section above to see the exact
                  content being uploaded.
                </Typography>
              </Alert>

              <Button
                variant="contained"
                color="primary"
                endIcon={<CloudUploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
                disabled={!schemaValid && !forceAllowDownload}
                className="mt-4"
                data-cy="upload-drive-button"
              >
                Upload Data Dictionary to Drive
              </Button>
            </div>
            <Divider className="my-6 w-full max-w-2xl" />
          </>
        )}

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

        <div className="flex gap-4">
          <Button
            data-cy="download-datadictionary-button"
            variant="contained"
            color={schemaValid ? 'success' : 'warning'}
            disabled={!schemaValid && !forceAllowDownload}
            onClick={handleDownload}
            endIcon={<DownloadIcon />}
          >
            Download Data Dictionary
          </Button>
        </div>
      </div>

      <Button
        data-cy="annotate-new-dataset-button"
        variant="contained"
        color="info"
        onClick={handleAnnotatingNewDataset}
        className="mt-4"
        endIcon={<NoteAddIcon />}
      >
        Annotate a new dataset
      </Button>

      <GoogleDriveUpload
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        dataDictionary={dataDictionary}
      />
    </div>
  );
}

export default Download;
