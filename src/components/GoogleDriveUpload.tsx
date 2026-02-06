import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { DataDictionary } from '../utils/internal_types';

interface GoogleDriveUploadProps {
  open: boolean;
  onClose: () => void;
  dataDictionary: DataDictionary;
  appsScriptUrl?: string;
}

const defaultProps = {
  appsScriptUrl: import.meta.env.NB_GOOGLE_APPS_SCRIPT_URL,
};

function GoogleDriveUpload({
  open,
  onClose,
  dataDictionary,
  appsScriptUrl = import.meta.env.NB_GOOGLE_APPS_SCRIPT_URL,
}: GoogleDriveUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<string[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [showSiteSuccess, setShowSiteSuccess] = useState(false);

  const [site, setSite] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [notes, setNotes] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);

  const hasAppsScriptUrl = !!appsScriptUrl;

  const handleClose = () => {
    onClose();
    // Wait for the exit animation to finish before resetting state
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadedUrl(null);
      setDatasetName('');
      setNotes('');
    }, 300);
  };

  const fetchSites = async () => {
    setLoadingSites(true);
    setShowSiteSuccess(false);
    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getSites' }),
      });
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.sites)) {
        setSites(result.sites);
        if (result.sites.length > 0) {
          setSite(result.sites[0]);
        }
        setShowSiteSuccess(true);
        setTimeout(() => setShowSiteSuccess(false), 2000);
      }
    } catch (fetchErr) {
      // TODO: show a notif error
    } finally {
      setLoadingSites(false);
    }
  };

  useEffect(() => {
    if (open && hasAppsScriptUrl) {
      fetchSites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasAppsScriptUrl]);

  const generateFilename = () => {
    const siteSanitized = site.replace(/[^a-z0-9]/gi, '_');
    const datasetSanitized = datasetName ? datasetName.replace(/[^a-z0-9]/gi, '_') : 'dataset';
    return `${siteSanitized}_${datasetSanitized}.json`;
  };

  const handleUpload = async (forceOverwrite = false) => {
    if (!hasAppsScriptUrl) {
      setError('Google Apps Script URL not configured.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const filename = generateFilename();
      const fileContent = JSON.stringify(dataDictionary, null, 2);

      let commentsContent;
      if (notes && notes.trim().length > 0) {
        commentsContent = `Uploader Metadata
=================
Name:  ${name || 'Anonymous'}
Email: ${email || 'N/A'}
Date:  ${new Date().toLocaleString()}

User Notes/Comments:
--------------------
${notes}`;
      }

      const payload = {
        filename,
        content: fileContent,
        description: `Uploaded by ${name} (${email}). Notes: ${notes}`,
        folderName: site,
        commentsContent,
        checkExists: !forceOverwrite,
        password,
      };

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
      } else if (result.status === 'conflict') {
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
            Successfully uploaded <strong>{generateFilename()}</strong> to Google Drive!
          </Alert>
          {uploadedUrl && (
            <Button
              variant="outlined"
              target="_blank"
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
            Google Apps Script URL is not configured.
            <br />
            Please add <strong>NB_GOOGLE_APPS_SCRIPT_URL</strong>.
          </Alert>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 pt-2">
        <Typography
          variant="subtitle2"
          className="text-gray-500 uppercase tracking-wide font-semibold"
        >
          File Details
        </Typography>
        <TextField
          select
          label="Site"
          value={site}
          onChange={(e) => setSite(e.target.value)}
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
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          fullWidth
          required
          placeholder="e.g. My Study 2026"
          data-cy="dataset-name-input"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          data-cy="password-input"
        />

        <div
          className="mt-2 p-3 bg-gray-50 rounded border border-gray-200"
          data-cy="filename-preview"
        >
          <Typography variant="caption" className="block text-gray-500 uppercase tracking-wide">
            Filename Preview
          </Typography>
          <Typography variant="body2" className="font-mono text-gray-800">
            {generateFilename()}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            data-cy="user-name-input"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            data-cy="user-email-input"
          />
        </div>
        <TextField
          label="Questions / Comments / Problems"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        data-cy="google-drive-upload-dialog"
      >
        <DialogTitle>Upload to Google Drive</DialogTitle>
        <DialogContent>{renderContent()}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" data-cy="close-button">
            {uploadSuccess ? 'Close' : 'Cancel'}
          </Button>
          {hasAppsScriptUrl && !uploadSuccess && (
            <Button
              onClick={() => handleUpload(false)}
              variant="contained"
              color="primary"
              disabled={uploading || !datasetName || !password}
              data-cy="upload-button"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={showConfirmOverwrite}
        onClose={() => setShowConfirmOverwrite(false)}
        data-cy="overwrite-dialog"
      >
        <DialogTitle>File Already Exists</DialogTitle>
        <DialogContent>
          <Typography>
            A file named <strong>{generateFilename()}</strong> already exists in{' '}
            <strong>{site}</strong>.
            <br />
            <br />
            Would you like to overwrite it?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmOverwrite(false)}
            color="inherit"
            data-cy="overwrite-cancel-button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowConfirmOverwrite(false);
              handleUpload(true);
            }}
            color="error"
            variant="contained"
            autoFocus
            data-cy="overwrite-confirm-button"
          >
            Overwrite
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

GoogleDriveUpload.defaultProps = defaultProps;
export default GoogleDriveUpload;
