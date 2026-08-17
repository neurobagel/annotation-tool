import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUploadValidation } from './useUploadValidation';

describe('useUploadValidation', () => {
  let onFileUploadMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFileUploadMock = vi.fn();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() =>
      useUploadValidation({ allowedFileType: '.tsv', onFileUpload: onFileUploadMock })
    );

    expect(result.current.hasError).toBe(false);
    expect(result.current.errorMessage).toBe('');
    expect(result.current.hasWarning).toBe(false);
    expect(result.current.warningMessage).toBe('');
    expect(result.current.fileInputRef.current).toBeNull();
  });

  describe('TSV Validation', () => {
    it('should reject a file with an invalid extension', () => {
      const { result } = renderHook(() =>
        useUploadValidation({ allowedFileType: '.tsv', onFileUpload: onFileUploadMock })
      );

      const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });

      act(() => {
        result.current.validateAndUpload(invalidFile);
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toBe('Invalid file type. Please upload a .tsv file.');
      expect(onFileUploadMock).not.toHaveBeenCalled();
    });

    it('should reject a TSV file with duplicate column names', async () => {
      const { result } = renderHook(() =>
        useUploadValidation({ allowedFileType: '.tsv', onFileUpload: onFileUploadMock })
      );

      const tsvContent = 'col1\tcol1\nval1\tval2';
      const duplicateHeaderFile = new File([tsvContent], 'test.tsv', {
        type: 'text/tab-separated-values',
      });

      act(() => {
        result.current.validateAndUpload(duplicateHeaderFile);
      });

      // Need to wait for FileReader
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toBe(
        'The uploaded data table contains duplicate column names. Please ensure all column names are unique.'
      );
      expect(onFileUploadMock).not.toHaveBeenCalled();
    });

    it('should show a warning for a TSV file with empty columns and rows', async () => {
      const { result } = renderHook(() =>
        useUploadValidation({ allowedFileType: '.tsv', onFileUpload: onFileUploadMock })
      );

      const tsvContent = 'col1\tcol2\n\t\nval1\t\nval2\t';
      const emptyCellsFile = new File([tsvContent], 'test.tsv', {
        type: 'text/tab-separated-values',
      });

      act(() => {
        result.current.validateAndUpload(emptyCellsFile);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.hasWarning).toBe(true);
      expect(result.current.warningMessage).toBe(
        'Warning: The uploaded file contains 1 empty column and 1 empty row.'
      );
      // Warning doesn't prevent upload
      expect(onFileUploadMock).toHaveBeenCalledWith(emptyCellsFile);
    });

    it('should successfully upload a valid TSV file without warnings', async () => {
      const { result } = renderHook(() =>
        useUploadValidation({ allowedFileType: '.tsv', onFileUpload: onFileUploadMock })
      );

      const tsvContent = 'col1\tcol2\nval1\tval2';
      const validFile = new File([tsvContent], 'test.tsv', { type: 'text/tab-separated-values' });

      act(() => {
        result.current.validateAndUpload(validFile);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.hasError).toBe(false);
      expect(result.current.hasWarning).toBe(false);
      expect(onFileUploadMock).toHaveBeenCalledWith(validFile);
    });
  });

  describe('JSON Validation', () => {
    it('should reject an invalid JSON file', async () => {
      const { result } = renderHook(() =>
        useUploadValidation({ allowedFileType: '.json', onFileUpload: onFileUploadMock })
      );

      const invalidJson = '{ "name": "test", }'; // Trailing comma
      const invalidFile = new File([invalidJson], 'test.json', { type: 'application/json' });

      act(() => {
        result.current.validateAndUpload(invalidFile);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toBe(
        'Invalid JSON file uploaded. Please check the file for syntax errors.'
      );
      expect(onFileUploadMock).not.toHaveBeenCalled();
    });

    it('should successfully upload a valid JSON file', async () => {
      const { result } = renderHook(() =>
        useUploadValidation({ allowedFileType: '.json', onFileUpload: onFileUploadMock })
      );

      const validJson = '{ "name": "test" }';
      const validFile = new File([validJson], 'test.json', { type: 'application/json' });

      act(() => {
        result.current.validateAndUpload(validFile);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(result.current.hasError).toBe(false);
      expect(result.current.hasWarning).toBe(false);
      expect(onFileUploadMock).toHaveBeenCalledWith(validFile);
    });
  });
});
