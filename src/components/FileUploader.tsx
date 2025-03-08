import { Card, Typography, useTheme, Tooltip } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

/*
Explicitly define the default props since eslint doesn't recognize the default props
passed along with the arguments
*/
const defaultProps = {
  disabled: false,
  tooltipContent: 'Uploading is disabled',
};

function FileUploader({
  id,
  displayText,
  handleClickToUpload,
  handleDrop,
  handleDragOver,
  handleFileUpload,
  fileInputRef,
  allowedFileType,
  disabled,
  tooltipContent,
}: {
  id: string;
  displayText: string;
  handleClickToUpload: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allowedFileType: string;
  disabled?: boolean;
  tooltipContent?: string;
}) {
  const theme = useTheme();

  // Disable click, drag, and drop functionality when `disabled` is true
  const handleClick = disabled ? () => {} : handleClickToUpload;
  const handleDrag = disabled ? () => {} : handleDrop;
  const handleDragOverEvent = disabled ? () => {} : handleDragOver;

  return (
    <Tooltip
      title={disabled ? <Typography variant="body1">{tooltipContent}</Typography> : ''}
      placement="top"
    >
      <Card
        data-cy={`${id}-upload-area`}
        elevation={3}
        className={`mx-auto max-w-[768px] rounded-3xl border-2 border-dashed p-8 transition-colors ${
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-100'
            : 'hover:border-primary-main cursor-pointer border-gray-300'
        }`}
        onClick={handleClick}
        onDrop={handleDrag}
        onDragOver={handleDragOverEvent}
        sx={{
          '&:hover': {
            borderColor: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
          },
        }}
      >
        <CloudUpload
          className="mb-4 text-4xl"
          sx={{
            color: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
          }}
        />
        <Typography variant="body1" className="mb-2" sx={{ color: theme.palette.text.primary }}>
          {displayText}
        </Typography>
        <Typography variant="body2" className="mb-4" sx={{ color: theme.palette.text.secondary }}>
          <span
            style={{
              fontWeight: 'bold',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
            }}
          >
            Click to upload
          </span>{' '}
          or drag and drop
        </Typography>
        <input
          data-cy={`${id}-upload-input`}
          type="file"
          hidden
          accept={allowedFileType}
          onChange={handleFileUpload}
          ref={fileInputRef}
          disabled={disabled}
        />
      </Card>
    </Tooltip>
  );
}

FileUploader.defaultProps = defaultProps;

export default FileUploader;
