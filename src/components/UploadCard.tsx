import { useRef, useState } from 'react';
import { Button, Card, Typography, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import FileUploader from './FileUploader';

interface UploadCardProps {
  title: string;
  allowedFileType: string;
  uploadedFileName: string | null;
  onFileUpload: (file: File) => void;
  previewComponent: React.ReactNode;
}

function UploadCard({
  title,
  allowedFileType,
  uploadedFileName,
  onFileUpload,
  previewComponent,
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
    <div className="mx-auto w-full max-w-[1024px] px-4">
      <Card
        data-cy={`${title}-upload-card`}
        className="rounded-3xl border-2 border-solid border-gray-300 p-4 text-center"
      >
        <Typography variant="h5" component="h2" className="mb-4 text-left">
          {title}
        </Typography>

        <FileUploader
          displayText={`Upload your file (${allowedFileType})`}
          handleClickToUpload={handleClickToUpload}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleFileUpload={handleFileUpload}
          fileInputRef={fileInputRef}
          allowedFileType={allowedFileType}
        />

        {isFileUploaded && (
          <div className="mt-4">
            <Typography
              variant="body1"
              className="mb-2"
              data-cy={`${title}-card-uploaded-file-name`}
            >
              <strong>{uploadedFileName}</strong>
            </Typography>
            <Button
              data-cy={`toggle-${title}-card-preview`}
              variant="outlined"
              onClick={togglePreview}
              endIcon={isPreviewOpen ? <ExpandLess /> : <ExpandMore />}
            >
              {isPreviewOpen ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>
        )}
      </Card>

      <Collapse in={isPreviewOpen} timeout="auto" unmountOnExit>
        {isFileUploaded && previewComponent}
      </Collapse>
    </div>
  );
}

export default UploadCard;
