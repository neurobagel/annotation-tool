import { CloudUpload, InsertDriveFile, ErrorOutline } from '@mui/icons-material';
import { Card, Typography, useTheme, Tooltip } from '@mui/material';

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
}: {
  id: string;
  displayText: string;
  handleClickToUpload: () => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  allowedFileType: string;
  disabled?: boolean;
  tooltipContent?: string;
  uploadedFileName?: string | null;
  hasError?: boolean;
  errorMessage?: string;
}) {
  const theme = useTheme();

  // Disable click, drag, and drop functionality when `disabled` is true
  const handleClick = disabled ? () => {} : handleClickToUpload;
  const handleDrag = disabled ? () => {} : handleDrop;
  const handleDragOverEvent = disabled ? () => {} : handleDragOver;

  const isFileSelected = !!uploadedFileName && !hasError;

  let uploadAreaClasses = 'mx-auto max-w-[768px] rounded-3xl border-2 transition-all ';

  if (disabled) {
    uploadAreaClasses += 'cursor-not-allowed border-gray-200 bg-gray-100 border-dashed p-8';
  } else if (isFileSelected) {
    uploadAreaClasses += 'cursor-pointer bg-blue-50/30 border-solid p-6';
  } else {
    uploadAreaClasses += 'cursor-pointer border-dashed p-8 ';
    if (!hasError) {
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
            isFileSelected && !disabled
              ? theme.palette.primary.main
              : hasError && !disabled
                ? theme.palette.error.main
                : undefined,
          '&:hover': {
            borderColor: disabled
              ? theme.palette.grey[400]
              : hasError
                ? theme.palette.error.main
                : theme.palette.primary.main,
            backgroundColor: isFileSelected && !disabled ? theme.palette.action.hover : undefined,
          },
        }}
      >
        {isFileSelected ? (
          <div className="flex flex-col items-center justify-center">
            <InsertDriveFile className="mb-2 text-4xl" sx={{ color: theme.palette.primary.main }} />
            <Typography
              data-cy={`${id}-uploaded-file-name`}
              variant="h6"
              className="mb-1 break-all font-medium"
              sx={{ color: theme.palette.text.primary }}
            >
              {uploadedFileName}
            </Typography>
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
            ) : (
              <CloudUpload
                className="mb-4 text-4xl"
                sx={{
                  color: disabled ? theme.palette.grey[400] : theme.palette.primary.main,
                }}
              />
            )}
            <Typography
              data-cy={`${id}-upload-text`}
              variant="body1"
              className="mb-2"
              sx={{ color: hasError ? theme.palette.error.main : theme.palette.text.primary }}
            >
              {hasError ? errorMessage : displayText}
            </Typography>
            <Typography
              variant="body2"
              className="mb-4"
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
