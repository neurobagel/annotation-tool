import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDatasetDescription } from '../stores/data';
import { useDatasetDescriptionFormValidation } from './useDatasetDescriptionFormValidation';

vi.mock('../stores/data', () => ({
  useDatasetDescription: vi.fn(),
}));

const mockedUseDatasetDescription = vi.mocked(useDatasetDescription);

describe('useDatasetDescriptionFormValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return valid when all fields are correct or empty (except Name)', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'Valid Name',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: '',
      AccessEmail: '',
      AccessLink: '',
    });

    const { result } = renderHook(() => useDatasetDescriptionFormValidation());
    expect(result.current.datasetDescriptionFormValidation.Name).toBe(false);
    expect(result.current.datasetDescriptionFormValidation.RepositoryURL).toBe(false);
    expect(result.current.datasetDescriptionFormValidation.AccessEmail).toBe(false);
    expect(result.current.datasetDescriptionFormValidation.AccessLink).toBe(false);
    expect(result.current.isFormInvalid).toBe(false);
  });

  it('should return isNameInvalid=true when Name is empty or whitespace', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: '   ',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: '',
      AccessEmail: '',
      AccessLink: '',
    });

    const { result } = renderHook(() => useDatasetDescriptionFormValidation());
    expect(result.current.datasetDescriptionFormValidation.Name).toBe(true);
    expect(result.current.isFormInvalid).toBe(true);
  });

  it('should return isRepoUrlInvalid=true when RepositoryURL is an invalid URL', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'Test Name',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: 'not-a-url',
      AccessEmail: '',
      AccessLink: '',
    });

    const { result } = renderHook(() => useDatasetDescriptionFormValidation());
    expect(result.current.datasetDescriptionFormValidation.RepositoryURL).toBe(true);
    expect(result.current.isFormInvalid).toBe(true);
  });

  it('should return isAccessEmailInvalid=true when AccessEmail is an invalid email', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'Test Name',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: '',
      AccessEmail: 'invalid-email',
      AccessLink: '',
    });

    const { result } = renderHook(() => useDatasetDescriptionFormValidation());
    expect(result.current.datasetDescriptionFormValidation.AccessEmail).toBe(true);
    expect(result.current.isFormInvalid).toBe(true);
  });

  it('should return isAccessLinkInvalid=true when AccessLink is an invalid URL', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'Test Name',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: '',
      AccessEmail: '',
      AccessLink: 'not-a-url-either',
    });

    const { result } = renderHook(() => useDatasetDescriptionFormValidation());
    expect(result.current.datasetDescriptionFormValidation.AccessLink).toBe(true);
    expect(result.current.isFormInvalid).toBe(true);
  });

  it('should validate correctly when all fields have valid values', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'Test Name',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: 'https://github.com/test',
      AccessEmail: 'test@example.com',
      AccessLink: 'https://example.com/access',
    });

    const { result } = renderHook(() => useDatasetDescriptionFormValidation());
    expect(result.current.isFormInvalid).toBe(false);
  });
});
