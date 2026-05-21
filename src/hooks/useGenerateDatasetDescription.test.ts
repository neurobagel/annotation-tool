import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useColumns, useDatasetDescription, useStandardizedVariables } from '../stores/data';
import { DataType, VariableType } from '../utils/internal_types';
import { useDatasetDescriptionValidation } from './useDatasetDescriptionValidation';
import { useGenerateDatasetDescription } from './useGenerateDatasetDescription';

vi.mock('../stores/data', () => ({
  useDatasetDescription: vi.fn(),
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

vi.mock('./useDatasetDescriptionValidation', () => ({
  useDatasetDescriptionValidation: vi.fn(),
}));

const mockedUseDatasetDescription = vi.mocked(useDatasetDescription);
const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);
const mockedUseDatasetDescriptionValidation = vi.mocked(useDatasetDescriptionValidation);

describe('useGenerateDatasetDescription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseColumns.mockReturnValue({});
    mockedUseStandardizedVariables.mockReturnValue({});
    mockedUseDatasetDescriptionValidation.mockReturnValue({
      isNameInvalid: false,
      isRepoUrlInvalid: false,
      isAccessEmailInvalid: false,
      isAccessLinkInvalid: false,
      isFormInvalid: false,
    });
  });

  it('should return null when the form is invalid', () => {
    mockedUseDatasetDescriptionValidation.mockReturnValue({
      isNameInvalid: true,
      isRepoUrlInvalid: false,
      isAccessEmailInvalid: false,
      isAccessLinkInvalid: false,
      isFormInvalid: true,
    });

    const { result } = renderHook(() => useGenerateDatasetDescription());
    expect(result.current).toBeNull();
  });

  it('should remove empty strings and correctly parse comma-separated lists', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'Valid Name',
      Authors: 'Author A, Author B, ',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: 'link1,link2',
      Keywords: 'key1, key2',
      RepositoryURL: '',
      AccessEmail: '',
      AccessLink: '',
    });

    const { result } = renderHook(() => useGenerateDatasetDescription());
    expect(result.current).toEqual({
      Name: 'Valid Name',
      Authors: ['Author A', 'Author B'],
      ReferencesAndLinks: ['link1', 'link2'],
      Keywords: ['key1', 'key2'],
    });
  });

  it('should calculate ParticipantCount from the Participant ID column', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'Participant Test',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: '',
      AccessEmail: '',
      AccessLink: '',
    });

    mockedUseColumns.mockReturnValue({
      col1: {
        id: 'col1',
        name: 'participant_id',
        allValues: ['sub-01', 'sub-02', 'sub-01'],
        dataType: DataType.categorical,
        standardizedVariable: 'nb:ParticipantID',
      },
    });

    mockedUseStandardizedVariables.mockReturnValue({
      'nb:ParticipantID': {
        id: 'nb:ParticipantID',
        name: 'Participant ID',
        variable_type: VariableType.identifier,
      },
    });

    const { result } = renderHook(() => useGenerateDatasetDescription());
    expect(result.current?.ParticipantCount).toBe(2);
    expect(result.current?.Name).toBe('Participant Test');
  });

  it('should not include ParticipantCount if there is no Participant ID column or no participants', () => {
    mockedUseDatasetDescription.mockReturnValue({
      Name: 'No Participants',
      Authors: '',
      AccessType: '',
      AccessInstructions: '',
      ReferencesAndLinks: '',
      Keywords: '',
      RepositoryURL: '',
      AccessEmail: '',
      AccessLink: '',
    });

    const { result } = renderHook(() => useGenerateDatasetDescription());
    expect(result.current?.ParticipantCount).toBeUndefined();
  });
});
