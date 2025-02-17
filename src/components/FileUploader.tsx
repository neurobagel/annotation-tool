import { Card, Typography, useTheme } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface FileUploaderProps {
  handleClickToUpload: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allowedFileType: string;
}

function FileUploader({
  handleClickToUpload,
  handleDrop,
  handleDragOver,
  handleFileUpload,
  fileInputRef,
  allowedFileType,
}: FileUploaderProps) {
  const theme = useTheme();

  return (
    <Card
      data-cy="upload-area"
      elevation={3}
      className="mx-auto max-w-[768px] cursor-pointer rounded-3xl border-2 border-dashed border-gray-300 p-8 transition-colors"
      onClick={handleClickToUpload}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      sx={{
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <CloudUpload
        className="mb-4 text-4xl text-gray-400"
        style={{ color: theme.palette.primary.main }}
      />
      <Typography variant="body1" className="mb-2">
        Upload your file ({allowedFileType.replace(/,/g, ', ')})
      </Typography>
      <Typography variant="body2" className="mb-4">
        <span
          style={{
            fontWeight: 'bold',
            cursor: 'pointer',
            color: theme.palette.primary.main,
          }}
        >
          Click to upload
        </span>{' '}
        or drag and drop
      </Typography>
      <input
        type="file"
        hidden
        accept={allowedFileType}
        onChange={handleFileUpload}
        ref={fileInputRef}
      />
    </Card>
  );
}

export default FileUploader;
