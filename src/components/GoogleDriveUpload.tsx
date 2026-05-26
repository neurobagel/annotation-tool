import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  LinearProgress,
  MenuItem,
  Alert,
  InputAdornment,
  CircularProgress,
  IconButton,
  Collapse,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { DataDictionary, DatasetDescription } from '../utils/internal_types';

interface GoogleDriveUploadProps {
  open: boolean;
  onClose: () => void;
  dataDictionary: DataDictionary;
  datasetDescription: DatasetDescription | null;
  appsScriptUrl?: string;
  config: string;
}

interface FormState {
  site: string;
  name: string;
  email: string;
  datasetName: string;
  notes: string;
  password: string;
  reuploadReason: string;
  customSuffix: string;
}

const defaultProps = {
  appsScriptUrl: import.meta.env.NB_GOOGLE_APPS_SCRIPT_URL,
};

const getTimestampSuffix = () =>
  new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];

const createUploadPayload = ({
  datasetName,
  dataDictionary,
  datasetDescription,
  notes,
  reuploadReason,
  name,
  email,
  site,
  password,
  forceOverwrite,
}: {
  datasetName: string;
  dataDictionary: DataDictionary;
  datasetDescription: DatasetDescription | null;
  notes: string;
  reuploadReason: string;
  name: string;
  email: string;
  site: string;
  password?: string;
  forceOverwrite: boolean;
}) => {
  const dataDictionaryContent = JSON.stringify(dataDictionary, null, 2);

  const datasetDescriptionFilename = datasetName.replace('.json', '_dataset_description.json');
  const datasetDescriptionContent = datasetDescription
    ? JSON.stringify(datasetDescription, null, 2)
    : null;

  let commentsContent;
  const hasNotes = notes && notes.trim().length > 0;
  const hasReason = reuploadReason && reuploadReason.trim().length > 0;

  if (hasNotes || hasReason) {
    commentsContent = `Uploader Metadata
=================
Name:  ${name || 'Anonymous'}
Email: ${email || 'N/A'}
Date:  ${new Date().toLocaleString()}

`;

    if (hasReason) {
      commentsContent += `Re-upload Reason:
-----------------
${reuploadReason}

`;
    }

    if (hasNotes) {
      commentsContent += `User Notes/Comments:
--------------------
${notes}`;
    }
  }

  return {
    folderName: site,
    password,
    commentsContent,
    checkExists: !forceOverwrite,
    files: [
      {
        filename: datasetName,
        content: dataDictionaryContent,
        description: `Data dictionary uploaded by ${name} (${email}). Notes: ${notes}`,
      },
      ...(datasetDescriptionContent
        ? [
            {
              filename: datasetDescriptionFilename,
              content: datasetDescriptionContent,
              description: `Dataset description uploaded by ${name} (${email}).`,
            },
          ]
        : []),
    ],
  };
};

const initialFormState: FormState = {
  site: '',
  name: '',
  email: '',
  datasetName: '',
  notes: '',
  password: '',
  reuploadReason: '',
  customSuffix: '',
};

function GoogleDriveUpload({
  open,
  onClose,
  dataDictionary,
  datasetDescription,
  appsScriptUrl = import.meta.env.NB_GOOGLE_APPS_SCRIPT_URL,
  config,
}: GoogleDriveUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<string[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [showSiteSuccess, setShowSiteSuccess] = useState(false);
  const [showUploadInfo, setShowUploadInfo] = useState(false);

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({
        ...prev,
        datasetName: prev.datasetName || (datasetDescription?.Name as string) || '',
      }));
    }
  }, [open, datasetDescription?.Name]);

  const [finalDatasetName, setFinalDatasetName] = useState('');
  const [suggestedSuffix, setSuggestedSuffix] = useState('');
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);

  const hasAppsScriptUrl = !!appsScriptUrl;

  const handleClose = () => {
    onClose();
    // Wait for the exit animation to finish before resetting state
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadedUrl(null);
      setShowConfirmOverwrite(false);
      setFinalDatasetName('');
      setSuggestedSuffix('');
      setError(null);
      setFormData(initialFormState);
    }, 300);
  };

  const fetchSites = useCallback(async () => {
    setLoadingSites(true);
    setShowSiteSuccess(false);
    setError(null);

    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getSites' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch site names: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.sites)) {
        setSites(result.sites);
        if (result.sites.length > 0) {
          setFormData((prev) => ({ ...prev, site: result.sites[0] }));
        }
        setShowSiteSuccess(true);
        setTimeout(() => setShowSiteSuccess(false), 2000);
      } else {
        throw new Error(result.message || 'Failed to load sites from Google Drive.');
      }
    } catch (fetchErr) {
      const message = fetchErr instanceof Error ? fetchErr.message : 'Unknown error loading sites';
      setError(message);
    } finally {
      setLoadingSites(false);
    }
  }, [appsScriptUrl]);

  useEffect(() => {
    if (open && hasAppsScriptUrl) {
      fetchSites();
    }
  }, [open, hasAppsScriptUrl, fetchSites]);

  const generateDatasetName = () => {
    const siteSanitized = formData.site.replace(/[^a-z0-9]/gi, '_');
    const datasetSanitized = formData.datasetName
      ? formData.datasetName.replace(/[^a-z0-9]/gi, '_')
      : 'dataset';
    return `${siteSanitized}_${datasetSanitized}.json`;
  };

  const handleUpload = async (forceOverwrite = false, overrideDatasetName?: string) => {
    if (!hasAppsScriptUrl) {
      setError('Google Apps Script URL not configured.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const datasetName = overrideDatasetName || generateDatasetName();
      const payload = createUploadPayload({
        datasetName,
        dataDictionary,
        datasetDescription,
        notes: formData.notes,
        reuploadReason: formData.reuploadReason,
        name: formData.name,
        email: formData.email,
        site: formData.site,
        password: formData.password,
        forceOverwrite,
      });

      const scriptUrl = appsScriptUrl;

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        setUploadSuccess(true);
        if (result.fileId) {
          const previewUrl = `https://drive.google.com/file/d/${result.fileId}/view`;
          setUploadedUrl(previewUrl);
        }
        // If we didn't have an override filename, it means we used the generated one.
        if (!overrideDatasetName) {
          setFinalDatasetName(generateDatasetName());
        } else {
          setFinalDatasetName(overrideDatasetName);
        }
      } else if (result.status === 'conflict') {
        setSuggestedSuffix(getTimestampSuffix());
        setShowConfirmOverwrite(true);
      } else if (result.status === 'auth_failed') {
        throw new Error(result.message || 'Authentication failed. Please check your password.');
      } else {
        throw new Error(result.message || 'Unknown error');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Upload failed: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const renderContent = () => {
    if (uploadSuccess) {
      return (
        <div className="flex flex-col gap-4">
          <Alert severity="success" data-cy="upload-success-alert">
            Successfully uploaded <strong>{finalDatasetName || generateDatasetName()}</strong> to
            Google Drive!
          </Alert>
          {uploadedUrl && (
            <Button
              variant="outlined"
              target="_blank"
              rel="noopener noreferrer"
              href={uploadedUrl}
              startIcon={<OpenInNewIcon />}
              sx={{ mt: 1 }}
              data-cy="open-drive-file-button"
            >
              Open File in Google Drive
            </Button>
          )}
        </div>
      );
    }

    if (!hasAppsScriptUrl) {
      return (
        <div className="flex flex-col items-center gap-4 py-8">
          <Alert severity="error" data-cy="config-error-alert">
            The data dictionary upload for <strong>{config}</strong> is not available.
            <br />
            Please contact your community admin to enable it.
          </Alert>
        </div>
      );
    }

    if (showConfirmOverwrite) {
      return (
        <div className="flex flex-col gap-4 pt-2">
          <Alert severity="warning">
            A dataset named <strong>{generateDatasetName()}</strong> already exists in{' '}
            <strong>{formData.site}</strong>.
            <br />
            <br />
            We will save this as a new version to avoid overwriting the existing file.
          </Alert>

          <Typography variant="body2" data-cy="new-dataset-name-preview">
            The new file will be named:
            <br />
            <strong>
              {generateDatasetName().replace(
                '.json',
                `_${formData.customSuffix || suggestedSuffix}.json`
              )}
            </strong>
          </Typography>

          <TextField
            label="Custom Suffix (Optional)"
            value={formData.customSuffix}
            onChange={(e) =>
              setFormData({
                ...formData,
                customSuffix: e.target.value.replace(/[^a-z0-9_-]/gi, ''),
              })
            }
            placeholder={`e.g. v2 (default: ${suggestedSuffix})`}
            fullWidth
            helperText="Only letters, numbers, hyphens, and underscores allowed."
            data-cy="custom-suffix-input"
          />

          <TextField
            label="Reason for re-upload / changes"
            value={formData.reuploadReason}
            onChange={(e) => setFormData({ ...formData, reuploadReason: e.target.value })}
            fullWidth
            multiline
            rows={2}
            data-cy="reupload-reason-input"
            helperText="Optional: Add a note about why this version is being created."
          />

          {uploading && <LinearProgress data-cy="upload-progress" />}
          {error && (
            <Alert severity="error" data-cy="upload-error-alert">
              {error}
            </Alert>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 pt-2">
        <Collapse in={showUploadInfo}>
          <Alert
            severity="info"
            className="mb-2 w-full"
            variant="filled"
            sx={{
              bgcolor: '#e5f6fd', // light cyan background
              borderLeft: '4px solid #0288d1', // info blue border
              color: 'rgba(0, 0, 0, 0.87)', // dark test for readability
              '& .MuiAlert-icon': {
                color: '#0288d1',
              },
            }}
          >
            <Typography variant="subtitle2" className="font-bold mb-1">
              About this upload:
            </Typography>
            <ul className="list-disc pl-5">
              <li>
                <Typography variant="body2">
                  The data dictionary and dataset description (if complete) will be uploaded. Your
                  tabular data remains local.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  The files will be uploaded to a private Google Drive folder for the ENIGMA-PD
                  community.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Refer to the &quot;Data Dictionary&quot; preview section above to see the exact
                  content being uploaded.
                </Typography>
              </li>
            </ul>
          </Alert>
        </Collapse>

        <Typography
          variant="subtitle2"
          className="text-gray-500 uppercase tracking-wide font-semibold"
        >
          File Details
        </Typography>
        <TextField
          select
          label="Site"
          value={formData.site}
          onChange={(e) => setFormData({ ...formData, site: e.target.value })}
          fullWidth
          disabled={loadingSites}
          data-cy="site-select"
          helperText={loadingSites ? 'Fetching sites from Google Drive...' : ''}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ marginRight: 2 }}>
                  {loadingSites && <CircularProgress size={20} color="inherit" />}
                  {!loadingSites && showSiteSuccess && (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                </InputAdornment>
              ),
            },
          }}
        >
          {sites.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Dataset Name"
          value={formData.datasetName}
          onChange={(e) => setFormData({ ...formData, datasetName: e.target.value })}
          fullWidth
          required
          placeholder="e.g. My Study 2026"
          data-cy="dataset-name-input"
        />

        <TextField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          fullWidth
          required
          data-cy="password-input"
        />

        <div
          className="mt-2 p-3 bg-gray-50 rounded border border-gray-200"
          data-cy="dataset-name-preview"
        >
          <Typography variant="caption" className="block text-gray-500 uppercase tracking-wide">
            Dataset Name Preview
          </Typography>
          <Typography variant="body2" className="font-mono text-gray-800">
            {generateDatasetName()}
          </Typography>
        </div>

        <Typography
          variant="subtitle2"
          className="block text-gray-500 uppercase tracking-wide font-semibold mt-4"
        >
          Feedback
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            data-cy="user-name-input"
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            data-cy="user-email-input"
          />
        </div>
        <TextField
          label="Questions / Comments / Problems"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          multiline
          rows={3}
          fullWidth
          data-cy="user-notes-input"
        />

        {uploading && <LinearProgress data-cy="upload-progress" />}
        {error && (
          <Alert severity="error" data-cy="upload-error-alert">
            {error}
          </Alert>
        )}
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      data-cy="google-drive-upload-dialog"
    >
      <DialogTitle>
        <div className="flex items-center gap-2">
          Upload to Google Drive
          {!uploadSuccess && !showConfirmOverwrite && (
            <IconButton
              size="small"
              onClick={() => setShowUploadInfo(!showUploadInfo)}
              color="info"
              data-cy="upload-info-button"
            >
              <InfoOutlinedIcon />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" data-cy="close-button">
          {uploadSuccess ? 'Close' : 'Cancel'}
        </Button>
        {hasAppsScriptUrl && !uploadSuccess && !showConfirmOverwrite && (
          <Button
            onClick={() => handleUpload(false)}
            variant="contained"
            color="primary"
            disabled={uploading || !formData.datasetName || !formData.password}
            data-cy="upload-button"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        )}
        {hasAppsScriptUrl && !uploadSuccess && showConfirmOverwrite && (
          <Button
            onClick={() => {
              const baseName = generateDatasetName().replace('.json', '');
              const suffix = formData.customSuffix || suggestedSuffix;
              const newDatasetName = `${baseName}_${suffix}.json`;
              // Do NOT close dialog or reset state here, just call upload
              // setShowConfirmOverwrite(false); // REMOVED
              handleUpload(true, newDatasetName);
            }}
            color="primary"
            variant="contained"
            disabled={uploading}
            data-cy="overwrite-confirm-button"
          >
            {uploading ? 'Uploading...' : 'Upload New Version'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

GoogleDriveUpload.defaultProps = defaultProps;
export default GoogleDriveUpload;
