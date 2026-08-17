import { useState, useEffect } from 'react';
import {
  DataDictionary,
  DatasetDescription,
  GoogleDriveUploadFormState,
} from '../utils/internal_types';
import { createUploadPayload, getTimestampSuffix } from '../utils/util';

interface UseGoogleDriveUploadProps {
  open: boolean;
  appsScriptUrl?: string;
  dataDictionary: DataDictionary;
  datasetDescription: DatasetDescription | null;
}

export const initialFormState: GoogleDriveUploadFormState = {
  site: '',
  name: '',
  email: '',
  datasetName: '',
  notes: '',
  password: '',
  reuploadReason: '',
  customSuffix: '',
};

export function useGoogleDriveUpload({
  open,
  appsScriptUrl,
  dataDictionary,
  datasetDescription,
}: UseGoogleDriveUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<string[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [showSiteSuccess, setShowSiteSuccess] = useState(false);
  const [showUploadInfo, setShowUploadInfo] = useState(false);

  const [formData, setFormData] = useState<GoogleDriveUploadFormState>(initialFormState);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);

  const hasAppsScriptUrl = !!appsScriptUrl;

  const [finalDatasetName, setFinalDatasetName] = useState('');
  const [suggestedSuffix, setSuggestedSuffix] = useState('');
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setFormData((prev) => ({
        ...prev,
        datasetName: prev.datasetName || (datasetDescription?.Name as string) || '',
      }));
      if (hasAppsScriptUrl) {
        setLoadingSites(true);
        setShowSiteSuccess(false);
        setError(null);
      }
    }
  }

  const resetState = () => {
    setUploadSuccess(false);
    setUploadedUrl(null);
    setShowConfirmOverwrite(false);
    setFinalDatasetName('');
    setSuggestedSuffix('');
    setError(null);
    setFormData(initialFormState);
  };

  useEffect(() => {
    let ignore = false;

    async function fetchSites() {
      try {
        const response = await fetch(appsScriptUrl!, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'getSites' }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch site names: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!ignore) {
          if (result.status === 'success' && Array.isArray(result.sites)) {
            setSites(result.sites);
            setShowSiteSuccess(true);
            setTimeout(() => {
              if (!ignore) setShowSiteSuccess(false);
            }, 2000);
          } else {
            throw new Error(result.message || 'Failed to load sites from Google Drive.');
          }
        }
      } catch (fetchErr) {
        if (!ignore) {
          const message =
            fetchErr instanceof Error ? fetchErr.message : 'Unknown error loading sites';
          setError(message);
        }
      } finally {
        if (!ignore) {
          setLoadingSites(false);
        }
      }
    }

    if (open && hasAppsScriptUrl) {
      fetchSites();
    }

    return () => {
      ignore = true;
    };
  }, [open, hasAppsScriptUrl, appsScriptUrl]);

  const generateDatasetName = () => {
    const siteSanitized = formData.site.replace(/[^a-z0-9]/gi, '_');
    const datasetSanitized = formData.datasetName
      ? formData.datasetName.replace(/[^a-z0-9]/gi, '_')
      : 'dataset';
    return `${siteSanitized}_${datasetSanitized}_annotated.json`;
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

      const response = await fetch(appsScriptUrl!, {
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

  return {
    error,
    sites,
    loadingSites,
    showSiteSuccess,
    showUploadInfo,
    setShowUploadInfo,
    formData,
    setFormData,
    uploading,
    uploadSuccess,
    uploadedUrl,
    hasAppsScriptUrl,
    finalDatasetName,
    suggestedSuffix,
    showConfirmOverwrite,
    generateDatasetName,
    handleUpload,
    resetState,
  };
}
