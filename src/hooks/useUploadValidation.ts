import { useRef, useState } from 'react';
import { parseTsvContent, readFile } from '../utils/data-utils';
import { AllowedFileType } from '../utils/internal_types';

export type ValidationResult =
  | { status: 'valid' }
  | { status: 'warning'; message: string }
  | { status: 'error'; message: string };

export function isValidFileExtension(fileName: string, allowedFileType: AllowedFileType): boolean {
  return fileName.toLowerCase().endsWith(allowedFileType);
}

export function validateTsvContent(contents: string): ValidationResult {
  const { headers, data } = parseTsvContent(contents);

  const uniqueHeaders = new Set(headers);
  if (uniqueHeaders.size !== headers.length) {
    return {
      status: 'error',
      message:
        'The uploaded data table contains duplicate column names. Please ensure all column names are unique.',
    };
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
    return { status: 'warning', message: warningMsg };
  }

  return { status: 'valid' };
}

export function validateJsonContent(contents: string): ValidationResult {
  try {
    JSON.parse(contents);
    return { status: 'valid' };
  } catch {
    return {
      status: 'error',
      message: 'Invalid JSON file uploaded. Please check the file for syntax errors.',
    };
  }
}

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

  const validateAndUpload = async (file: File) => {
    if (!isValidFileExtension(file.name, allowedFileType)) {
      setError(`Invalid file type. Please upload a ${allowedFileType} file.`);
      return;
    }

    let contents: string;
    try {
      contents = await readFile(file);
    } catch {
      setError('Unable to read the selected file. Please try again.');
      return;
    }

    let result: ValidationResult;
    switch (allowedFileType) {
      case '.tsv':
        result = validateTsvContent(contents);
        break;
      case '.json':
        result = validateJsonContent(contents);
        break;
      default:
        result = { status: 'error', message: 'Invalid file type.' };
        break;
    }

    if (result.status === 'error') {
      setError(result.message);
      return;
    }

    if (result.status === 'warning') {
      setWarning(result.message);
    } else {
      clearErrorsAndWarnings();
    }

    onFileUpload(file);
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
