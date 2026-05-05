import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Button, Card, CardHeader, CardContent, Collapse, Snackbar, Alert } from '@mui/material';
import { useRef, useState } from 'react';
import FileUploader from './FileUploader';

/*
Explicitly define the default props since eslint doesn't recognize the default props
passed along with the arguments
*/
const defaultProps = {
  diableFileUploader: false,
  FileUploaderToolTipContent: 'Uploading is disabled',
};

interface UploadCardProps {
  id: string;
  title: string;
  FileUploaderDisplayText: string;
  allowedFileType: string;
  uploadedFileName: string | null;
  onFileUpload: (file: File) => void;
  previewComponent: React.ReactNode;
  diableFileUploader?: boolean;
  FileUploaderToolTipContent?: string;
}

function UploadCard({
  id,
  title,
  FileUploaderDisplayText,
  allowedFileType,
  uploadedFileName,
  onFileUpload,
  previewComponent,
  diableFileUploader = false,
  FileUploaderToolTipContent = 'Uploading is disabled',
}: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFileUploaded = uploadedFileName !== null;

  const validateAndUpload = (file: File) => {
    if (file.name.endsWith('.json') || file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          JSON.parse(e.target?.result as string);
          setAlertOpen(false);
          onFileUpload(file);
        } catch (error) {
          setErrorMessage('Invalid JSON file uploaded. Please check the file for syntax errors.');
          setAlertOpen(true);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.readAsText(file);
    } else {
      setAlertOpen(false);
      onFileUpload(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      validateAndUpload(uploadedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndUpload(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const handleClickToUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1024px] rounded-3xl shadow-lg">
      <Card
        data-cy={`${id}-upload-card`}
        className="rounded-3xl border-2 border-solid border-gray-300 text-center"
      >
        <CardHeader title={title} className="bg-gray-50 text-left" />
        <CardContent>
          <FileUploader
            id={id}
            displayText={FileUploaderDisplayText}
            handleClickToUpload={handleClickToUpload}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleFileUpload={handleFileUpload}
            fileInputRef={fileInputRef}
            allowedFileType={allowedFileType}
            disabled={diableFileUploader}
            tooltipContent={FileUploaderToolTipContent}
            uploadedFileName={uploadedFileName}
          />

          {isFileUploaded && (
            <div className="mt-4">
              <Button
                data-cy={`${id}-toggle-preview-button`}
                variant="outlined"
                onClick={togglePreview}
                endIcon={isPreviewOpen ? <ExpandLess /> : <ExpandMore />}
              >
                {isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Collapse in={isPreviewOpen} timeout="auto" unmountOnExit>
        {isFileUploaded && previewComponent}
      </Collapse>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

UploadCard.defaultProps = defaultProps;

export default UploadCard;
