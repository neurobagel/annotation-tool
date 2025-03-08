import { useRef, useState } from 'react';
import { Button, Card, CardHeader, CardContent, Typography, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isFileUploaded = uploadedFileName !== null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      onFileUpload(uploadedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileUpload(droppedFile);
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
          />

          {isFileUploaded && (
            <div className="mt-4">
              <Typography variant="body1" className="mb-2" data-cy={`${id}-uploaded-file-name`}>
                <strong>{uploadedFileName}</strong>
              </Typography>
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
    </div>
  );
}

UploadCard.defaultProps = defaultProps;

export default UploadCard;
