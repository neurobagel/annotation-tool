import { Card, Typography, useTheme, Tooltip } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { styled } from '@mui/system';

/*
Explicitly define the default props since eslint doesn't recognize the default props
passed along with the arguments
*/
const defaultProps = {
  disabled: false,
  tooltipContent: 'Uploading is disabled',
};

interface FileUploaderProps {
  displayText: string;
  handleClickToUpload: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allowedFileType: string;
  disabled?: boolean;
  tooltipContent?: string;
}

interface StyledCardProps {
  disabled?: boolean;
}

const StyledCard = styled(Card, {
  /*
  Prevent 'disabled' from being forwarded to the DOM
  to avoid React warnings about invalid DOM attributes
  */
  shouldForwardProp: (prop) => prop !== 'disabled',
})<StyledCardProps>(({ theme, disabled }) => ({
  maxWidth: '768px',
  borderRadius: '24px',
  border: '2px dashed',
  padding: theme.spacing(8),
  transition: 'border-color 0.3s',
  margin: '0 auto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  borderColor: disabled ? theme.palette.grey[200] : theme.palette.grey[300],
  backgroundColor: disabled ? theme.palette.grey[100] : 'transparent',
  '&:hover': {
    borderColor: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
  },
}));

const StyledCloudUpload = styled(CloudUpload)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  fontSize: '4rem',
  marginBottom: theme.spacing(4),
  color: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const StyledClickToUpload = styled('span')<{ disabled?: boolean }>(({ theme, disabled }) => ({
  fontWeight: 'bold',
  cursor: disabled ? 'not-allowed' : 'pointer',
  color: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
}));

function FileUploader({
  displayText,
  handleClickToUpload,
  handleDrop,
  handleDragOver,
  handleFileUpload,
  fileInputRef,
  allowedFileType,
  disabled,
  tooltipContent,
}: FileUploaderProps) {
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
      <StyledCard
        data-cy="upload-area"
        elevation={3}
        onClick={handleClick}
        onDrop={handleDrag}
        onDragOver={handleDragOverEvent}
        disabled={disabled}
      >
        <StyledCloudUpload disabled={disabled} />
        <StyledTypography variant="body1">{displayText}</StyledTypography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, marginBottom: theme.spacing(4) }}
        >
          <StyledClickToUpload disabled={disabled}>Click to upload</StyledClickToUpload> or drag and
          drop
        </Typography>
        <input
          type="file"
          hidden
          accept={allowedFileType}
          onChange={handleFileUpload}
          ref={fileInputRef}
          disabled={disabled}
        />
      </StyledCard>
    </Tooltip>
  );
}

FileUploader.defaultProps = defaultProps;

export default FileUploader;
