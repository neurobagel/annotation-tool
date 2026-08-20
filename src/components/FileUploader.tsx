import { CloudUpload, InsertDriveFile, ErrorOutline } from '@mui/icons-material';
import { Card, Typography, useTheme, Tooltip } from '@mui/material';
import { AllowedFileType } from '../utils/internal_types';

/*
Explicitly define the default props since eslint doesn't recognize the default props
passed along with the arguments
*/
const defaultProps = {
  disabled: false,
  tooltipContent: 'Uploading is disabled',
  uploadedFileName: null,
  hasError: false,
  errorMessage: '',
  hasWarning: false,
  warningMessage: '',
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
  uploadedFileName,
  hasError,
  errorMessage,
  hasWarning,
  warningMessage,
}: {
  id: string;
  displayText: string;
  handleClickToUpload: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  allowedFileType: AllowedFileType;
  disabled?: boolean;
  tooltipContent?: string;
  uploadedFileName?: string | null;
  hasError?: boolean;
  errorMessage?: string;
  hasWarning?: boolean;
  warningMessage?: string;
}) {
  const theme = useTheme();

  // Disable click, drag, and drop functionality when `disabled` is true
  const handleClick = disabled ? () => {} : handleClickToUpload;
  const handleDrag = disabled ? () => {} : handleDrop;
  const handleDragOverEvent = disabled ? () => {} : handleDragOver;

  const isFileSelected = !!uploadedFileName && !hasError;

  let uploadAreaClasses = 'mx-auto max-w-[768px] rounded-3xl border-2 transition-all ';

  if (disabled) {
    uploadAreaClasses += 'cursor-not-allowed border-gray-200 bg-gray-100 border-dashed p-6';
  } else if (isFileSelected) {
    uploadAreaClasses += 'cursor-pointer bg-blue-50/30 border-solid p-4';
  } else {
    uploadAreaClasses += 'cursor-pointer border-dashed p-6';
    if (!hasError && !hasWarning) {
      uploadAreaClasses += 'border-gray-300 hover:border-primary-main';
    }
  }

  return (
    <Tooltip
      title={disabled ? <Typography variant="body1">{tooltipContent}</Typography> : ''}
      placement="top"
    >
      <Card
        data-cy={`${id}-upload-area`}
        elevation={isFileSelected ? 0 : 3}
        className={uploadAreaClasses}
        onClick={handleClick}
        onDrop={handleDrag}
        onDragOver={handleDragOverEvent}
        sx={{
          borderColor:
            hasError && !disabled
              ? theme.palette.error.main
              : hasWarning && !disabled
                ? theme.palette.warning.main
                : isFileSelected && !disabled
                  ? theme.palette.primary.main
                  : undefined,
          '&:hover': {
            borderColor: disabled
              ? theme.palette.grey[400]
              : hasError
                ? theme.palette.error.main
                : hasWarning
                  ? theme.palette.warning.main
                  : theme.palette.primary.main,
            backgroundColor: isFileSelected && !disabled ? theme.palette.action.hover : undefined,
          },
        }}
      >
        {isFileSelected ? (
          <div className="flex flex-col items-center justify-center">
            <InsertDriveFile
              className="mb-1 text-3xl"
              sx={{ color: hasWarning ? theme.palette.warning.main : theme.palette.primary.main }}
            />
            <Typography
              data-cy={`${id}-uploaded-file-name`}
              variant="h6"
              className="mb-1 break-all font-medium"
              sx={{ color: theme.palette.text.primary }}
            >
              {uploadedFileName}
            </Typography>
            {hasWarning && (
              <Typography
                data-cy={`${id}-warning-text`}
                variant="body2"
                className="mb-2 max-w-[80%]"
                sx={{ color: theme.palette.warning.main, fontWeight: 'bold' }}
              >
                {warningMessage}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              <span
                style={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                }}
              >
                Click to replace
              </span>{' '}
              or drag and drop
            </Typography>
          </div>
        ) : (
          <>
            {hasError ? (
              <ErrorOutline
                className="mb-4 text-4xl"
                sx={{ color: theme.palette.error.main }}
                data-cy={`${id}-error-icon`}
              />
            ) : hasWarning ? (
              <ErrorOutline
                className="mb-4 text-4xl"
                sx={{ color: theme.palette.warning.main }}
                data-cy={`${id}-warning-icon`}
              />
            ) : (
              <CloudUpload
                className="mb-1 text-4xl"
                sx={{
                  color: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
                }}
              />
            )}
            <Typography
              data-cy={`${id}-upload-text`}
              variant="body1"
              className="mb-1"
              sx={{
                color: hasError
                  ? theme.palette.error.main
                  : hasWarning
                    ? theme.palette.warning.main
                    : theme.palette.text.primary,
              }}
            >
              {hasError ? errorMessage : hasWarning ? warningMessage : displayText}
            </Typography>
            <Typography
              variant="body2"
              className="mb-2"
              sx={{ color: theme.palette.text.secondary }}
            >
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
          </>
        )}

        <input
          data-cy={`${id}-upload-input`}
          type="file"
          hidden
          accept={allowedFileType}
          onChange={handleFileUpload}
          ref={fileInputRef as React.Ref<HTMLInputElement>}
          disabled={disabled}
        />
      </Card>
    </Tooltip>
  );
}

FileUploader.defaultProps = defaultProps;

export default FileUploader;
