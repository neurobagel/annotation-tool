import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDatasetDescription } from '../stores/data';
import { useDatasetDescriptionValidation } from './useDatasetDescriptionValidation';

vi.mock('../stores/data', () => ({
  useDatasetDescription: vi.fn(),
}));

const mockedUseDatasetDescription = vi.mocked(useDatasetDescription);

describe('useDatasetDescriptionValidation', () => {
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

    const { result } = renderHook(() => useDatasetDescriptionValidation());
    expect(result.current.isNameInvalid).toBe(false);
    expect(result.current.isRepoUrlInvalid).toBe(false);
    expect(result.current.isAccessEmailInvalid).toBe(false);
    expect(result.current.isAccessLinkInvalid).toBe(false);
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

    const { result } = renderHook(() => useDatasetDescriptionValidation());
    expect(result.current.isNameInvalid).toBe(true);
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

    const { result } = renderHook(() => useDatasetDescriptionValidation());
    expect(result.current.isRepoUrlInvalid).toBe(true);
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

    const { result } = renderHook(() => useDatasetDescriptionValidation());
    expect(result.current.isAccessEmailInvalid).toBe(true);
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

    const { result } = renderHook(() => useDatasetDescriptionValidation());
    expect(result.current.isAccessLinkInvalid).toBe(true);
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

    const { result } = renderHook(() => useDatasetDescriptionValidation());
    expect(result.current.isFormInvalid).toBe(false);
  });
});
