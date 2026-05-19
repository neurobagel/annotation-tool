import DownloadIcon from '@mui/icons-material/Download';
import { Alert, Typography, Button } from '@mui/material';
import { useMemo } from 'react';
import { useIsParticipantIDMapped } from '../hooks/useIsParticipantIDMapped';
import {
  useDatasetDescription,
  useColumns,
  useStandardizedVariables,
  useUploadedDataTableFileName,
} from '../stores/data';
import { isValidUrl, emailRegex } from '../utils/util';
import DatasetDescriptionForm from './DatasetDescriptionForm';

function DatasetDescription() {
  const datasetDescription = useDatasetDescription();
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const uploadedDataTableFileName = useUploadedDataTableFileName();
  const { hasMappedParticipantId, hasMappedOtherColumns } = useIsParticipantIDMapped();

  const participantCount = useMemo(() => {
    let count = 0;
    const participantColumn = Object.values(columns).find((col) => {
      const stdVar = col.standardizedVariable
        ? standardizedVariables[col.standardizedVariable]
        : null;
      return stdVar?.name === 'Participant ID';
    });

    if (participantColumn) {
      const uniqueIDs = new Set(participantColumn.allValues);
      count = uniqueIDs.size;
    }
    return count;
  }, [columns, standardizedVariables]);

  const isNameInvalid = datasetDescription.Name.trim() === '';
  const isRepoUrlInvalid =
    datasetDescription.RepositoryURL.trim() !== '' &&
    !isValidUrl(datasetDescription.RepositoryURL.trim());
  const isAccessEmailInvalid =
    datasetDescription.AccessEmail.trim() !== '' &&
    !emailRegex.test(datasetDescription.AccessEmail.trim());
  const isAccessLinkInvalid =
    datasetDescription.AccessLink.trim() !== '' &&
    !isValidUrl(datasetDescription.AccessLink.trim());

  const isFormInvalid =
    isNameInvalid || isRepoUrlInvalid || isAccessEmailInvalid || isAccessLinkInvalid;

  const handleDownloadDescription = () => {
    const baseFileName = uploadedDataTableFileName?.slice(0, -4) || 'dataset';

    const finalDatasetDescription: Record<string, string | number | string[]> = {};

    const listFields = ['Authors', 'ReferencesAndLinks', 'Keywords'];

    Object.entries(datasetDescription).forEach(([k, v]) => {
      if (listFields.includes(k) && typeof v === 'string') {
        const parsedList = v
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s !== '');
        if (parsedList.length > 0) {
          finalDatasetDescription[k] = parsedList;
        }
      } else if (Array.isArray(v)) {
        if (v.length > 0) {
          finalDatasetDescription[k] = v;
        }
      } else if (typeof v === 'string' && v.trim() !== '') {
        finalDatasetDescription[k] = v.trim();
      }
    });

    if (participantCount > 0) {
      finalDatasetDescription.ParticipantCount = participantCount;
    }

    const descriptionBlob = new Blob([JSON.stringify(finalDatasetDescription, null, 2)], {
      type: 'application/json;charset=utf-8',
    });

    const descriptionUrl = URL.createObjectURL(descriptionBlob);
    const descriptionA = document.createElement('a');
    descriptionA.href = descriptionUrl;
    descriptionA.download = `${baseFileName}_dataset_description.json`;
    document.body.appendChild(descriptionA);
    descriptionA.click();
    URL.revokeObjectURL(descriptionUrl);
    document.body.removeChild(descriptionA);
  };

  return (
    <div className="flex flex-col items-center p-6" data-cy="dataset-description-page">
      {hasMappedOtherColumns && !hasMappedParticipantId && (
        <Alert
          severity="warning"
          data-cy="missing-participant-id-warning"
          className="mb-6 w-full max-w-2xl"
        >
          <Typography variant="h6" className="mb-2 font-bold">
            Missing Participant ID
          </Typography>
          <Typography variant="body1">
            You have not mapped a <b>Participant ID</b> column. Without a Participant ID, your
            dataset description will be incomplete as it cannot calculate the total number of
            participants.
          </Typography>
        </Alert>
      )}

      <div className="w-full max-w-2xl">
        <DatasetDescriptionForm />
      </div>

      <div className="flex w-full flex-col items-center mt-6">
        <div className="flex gap-4">
          <Button
            variant="contained"
            color="success"
            endIcon={<DownloadIcon />}
            onClick={handleDownloadDescription}
            disabled={isFormInvalid}
            data-cy="download-dataset-description-button"
          >
            Download Dataset Description
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DatasetDescription;
