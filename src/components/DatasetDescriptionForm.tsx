import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  TextField,
  MenuItem,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Tooltip,
} from '@mui/material';
import { useDatasetDescriptionFormValidation } from '../hooks/useDatasetDescriptionFormValidation';
import { useDatasetDescription, useDataActions } from '../stores/data';
import { DatasetDescriptionFormState } from '../utils/internal_types';

const ACCESS_TYPES = ['public', 'registered', 'restricted'];
const ACCESS_TYPE_TOOLTIPS: Record<string, string> = {
  public: 'Immediately accessible without registration, authentication, or approval.',
  registered:
    'Requires authentication or agreement to basic terms of use, but no formal application or review.',
  restricted: 'Requires formal approval or review of a data access request.',
};

function ArrayPreviewDisplay({ value, dataCy }: { value: string; dataCy: string }) {
  if (value.trim() === '') return null;

  const arr = value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v !== '');

  if (arr.length === 0) return null;

  return (
    <Box className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-700" data-cy={dataCy}>
      {`[${arr.map((item) => JSON.stringify(item)).join(', ')}]`}
    </Box>
  );
}

function DatasetDescriptionForm() {
  const datasetDescription = useDatasetDescription();
  const { userUpdatesDatasetDescription } = useDataActions();

  const { datasetDescriptionFormValidation } = useDatasetDescriptionFormValidation();

  const handleChange =
    (field: keyof DatasetDescriptionFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      userUpdatesDatasetDescription(field, event.target.value);
    };

  return (
    <Box className="flex flex-col gap-4 mb-6 w-full max-w-2xl" data-cy="dataset-description-form">
      <Typography variant="h5" className="font-bold">
        Dataset Description
      </Typography>
      <Typography variant="body2" className="text-gray-600 mb-4">
        The information you enter into this form will be available to download as a
        dataset_description.json file on the next page. For more information about each dataset
        description field, see the{' '}
        <Link
          href="https://neurobagel.org/user_guide/dataset_description/#dataset-description-fields"
          target="_blank"
          rel="noreferrer"
        >
          user guide
        </Link>
        .
      </Typography>

      <TextField
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        label="Name"
        required
        value={datasetDescription.Name}
        onChange={handleChange('Name')}
        error={datasetDescriptionFormValidation.Name}
        helperText={
          datasetDescriptionFormValidation.Name ? 'Name is required and cannot be blank' : ''
        }
        fullWidth
        size="small"
        placeholder="e.g. My Awesome Dataset"
        data-cy="dataset-name-input"
      />

      <Box className="flex flex-col gap-1">
        <TextField
          label="Authors"
          value={datasetDescription.Authors as string}
          onChange={handleChange('Authors')}
          helperText="Enter a comma-separated list of authors"
          fullWidth
          size="small"
          placeholder="e.g. John Doe, Jane Smith"
          data-cy="dataset-authors-input"
        />
        <ArrayPreviewDisplay
          value={datasetDescription.Authors as string}
          dataCy="authors-preview"
        />
      </Box>

      <Box className="flex flex-col gap-2">
        <Accordion
          defaultExpanded
          variant="outlined"
          className="shadow-none border border-gray-300"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="bg-gray-50 min-h-0 h-10">
            <Typography className="font-medium text-gray-700 text-sm uppercase tracking-wider">
              Access info
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="flex flex-col gap-4 pt-4">
            <Typography variant="body2" className="text-gray-600 mb-2">
              Provide details on how others can access or request the raw dataset. This information
              will be shown to researchers who discover your data and has no effect on the
              visibility or access restrictions of your data.
            </Typography>
            <TextField
              select
              label="Access Type"
              value={datasetDescription.AccessType}
              onChange={handleChange('AccessType')}
              fullWidth
              size="small"
              data-cy="dataset-accesstype-select"
            >
              {ACCESS_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  <Tooltip title={ACCESS_TYPE_TOOLTIPS[type]} placement="right" arrow>
                    <span className="w-full block">{type}</span>
                  </Tooltip>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Access Instructions"
              value={datasetDescription.AccessInstructions}
              onChange={handleChange('AccessInstructions')}
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="How to access this dataset"
              data-cy="dataset-instructions-input"
            />
            <TextField
              label="Repository URL"
              value={datasetDescription.RepositoryURL}
              onChange={handleChange('RepositoryURL')}
              error={datasetDescriptionFormValidation.RepositoryURL}
              helperText={
                datasetDescriptionFormValidation.RepositoryURL
                  ? 'Must be a valid HTTP/HTTPS URL'
                  : ''
              }
              fullWidth
              size="small"
              placeholder="e.g. https://github.com/my-repo"
              data-cy="dataset-repo-input"
            />
            <TextField
              label="Access Email"
              value={datasetDescription.AccessEmail}
              onChange={handleChange('AccessEmail')}
              error={datasetDescriptionFormValidation.AccessEmail}
              helperText={
                datasetDescriptionFormValidation.AccessEmail ? 'Must be a valid email address' : ''
              }
              fullWidth
              size="small"
              placeholder="e.g. contact@domain.com"
              data-cy="dataset-accessemail-input"
            />
            <TextField
              label="Access Link"
              value={datasetDescription.AccessLink}
              onChange={handleChange('AccessLink')}
              error={datasetDescriptionFormValidation.AccessLink}
              helperText={
                datasetDescriptionFormValidation.AccessLink ? 'Must be a valid HTTP/HTTPS URL' : ''
              }
              fullWidth
              size="small"
              placeholder="e.g. https://domain.com/access"
              data-cy="dataset-accesslink-input"
            />
          </AccordionDetails>
        </Accordion>

        <Accordion variant="outlined" className="shadow-none border border-gray-300">
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className="bg-gray-50 min-h-0 h-10">
            <Typography className="font-medium text-gray-700 text-sm uppercase tracking-wider">
              Reference info
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="flex flex-col gap-4 pt-4">
            <Typography variant="body2" className="text-gray-600">
              Add links, relevant papers, and keywords to help others better understand your
              dataset.
            </Typography>
            <Box className="flex flex-col gap-1">
              <TextField
                label="References and Links"
                value={datasetDescription.ReferencesAndLinks as string}
                onChange={handleChange('ReferencesAndLinks')}
                helperText="Enter a comma-separated list of URLs or citations"
                fullWidth
                size="small"
                placeholder="e.g. https://domain.com/paper, Author et al. (2024)"
                data-cy="dataset-references-input"
              />
              <ArrayPreviewDisplay
                value={datasetDescription.ReferencesAndLinks as string}
                dataCy="references-preview"
              />
            </Box>
            <Box className="flex flex-col gap-1">
              <TextField
                label="Keywords"
                value={datasetDescription.Keywords as string}
                onChange={handleChange('Keywords')}
                helperText="Enter a comma-separated list of keywords"
                fullWidth
                size="small"
                placeholder="e.g. fMRI, neuroimaging, nback"
                data-cy="dataset-keywords-input"
              />
              <ArrayPreviewDisplay
                value={datasetDescription.Keywords as string}
                dataCy="keywords-preview"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

export default DatasetDescriptionForm;
