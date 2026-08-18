import { useRef, useState } from 'react';
import { parseTsvContent } from '../utils/data-utils';
import { AllowedFileType } from '../utils/internal_types';

interface UseUploadValidationOptions {
  allowedFileType: AllowedFileType;
  onFileUpload: (file: File) => void;
}

export function useUploadValidation({ allowedFileType, onFileUpload }: UseUploadValidationOptions) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasWarning, setHasWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const setError = (message: string) => {
    setErrorMessage(message);
    setHasError(true);
    setHasWarning(false);
    setWarningMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setWarning = (message: string) => {
    setWarningMessage(message);
    setHasWarning(true);
    setHasError(false);
    setErrorMessage('');
  };

  const clearErrorsAndWarnings = () => {
    setHasError(false);
    setErrorMessage('');
    setHasWarning(false);
    setWarningMessage('');
  };

  const validateAndUpload = (file: File) => {
    switch (allowedFileType) {
      case '.tsv': {
        if (!file.name.toLowerCase().endsWith('.tsv')) {
          setError('Invalid file type. Please upload a .tsv file.');
          return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          const contents = e.target?.result;
          if (typeof contents !== 'string') {
            setError('Unable to read the selected file. Please try again.');
            return;
          }

          const { headers, data } = parseTsvContent(contents);

          const uniqueHeaders = new Set(headers);
          if (uniqueHeaders.size !== headers.length) {
            setError(
              'The uploaded data table contains duplicate column names. Please ensure all column names are unique.'
            );
            return;
          }

          let emptyRowsCount = 0;
          let emptyColsCount = 0;

          for (const row of data) {
            if (row.every((cell) => cell.trim() === '')) {
              emptyRowsCount++;
            }
          }

          for (let colIndex = 0; colIndex < headers.length; colIndex++) {
            let isColEmpty = true;
            for (const row of data) {
              if (row[colIndex] && row[colIndex].trim() !== '') {
                isColEmpty = false;
                break;
              }
            }
            if (isColEmpty) {
              emptyColsCount++;
            }
          }

          if (emptyRowsCount > 0 || emptyColsCount > 0) {
            let warningMsg = 'Warning: The uploaded file contains';
            const parts = [];
            if (emptyColsCount > 0) {
              parts.push(` ${emptyColsCount} empty column${emptyColsCount > 1 ? 's' : ''}`);
            }
            if (emptyRowsCount > 0) {
              parts.push(` ${emptyRowsCount} empty row${emptyRowsCount > 1 ? 's' : ''}`);
            }
            warningMsg += parts.join(' and') + '.';
            setWarning(warningMsg);
          } else {
            clearErrorsAndWarnings();
          }

          onFileUpload(file);
        };

        reader.onerror = () => {
          setError('Unable to read the selected file. Please try again.');
        };

        reader.readAsText(file);
        break;
      }

      case '.json': {
        const reader = new FileReader();

        reader.onload = (e) => {
          const contents = e.target?.result;
          if (typeof contents !== 'string') {
            setError('Unable to read the selected file. Please try again.');
            return;
          }

          try {
            JSON.parse(contents);
            clearErrorsAndWarnings();
            onFileUpload(file);
          } catch {
            setError('Invalid JSON file uploaded. Please check the file for syntax errors.');
          }
        };

        reader.onerror = () => {
          setError('Unable to read the selected file. Please try again.');
        };

        reader.readAsText(file);
        break;
      }

      default: {
        clearErrorsAndWarnings();
        onFileUpload(file);
        break;
      }
    }
  };

  return {
    fileInputRef,
    hasError,
    errorMessage,
    hasWarning,
    warningMessage,
    validateAndUpload,
  };
}
