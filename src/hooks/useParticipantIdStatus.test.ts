import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as dataStore from '../stores/data';
import { Columns, StandardizedVariables, VariableType } from '../utils/internal_types';
import { useParticipantIdStatus } from './useParticipantIdStatus';

vi.mock('../stores/data', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

describe('useParticipantIdStatus', () => {
  it('should return false for both when no columns are mapped', () => {
    vi.mocked(dataStore.useColumns).mockReturnValue({});
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue({});

    const { result } = renderHook(() => useParticipantIdStatus());
    expect(result.current).toEqual({
      hasMappedParticipantId: false,
      hasMappedOtherColumns: false,
      hasParticipantIdMissingValues: false,
      participantIdColumnName: null,
    });
  });

  it('should return true for isParticipantIDMapped and false for hasMappedOtherColumns when only participant ID is mapped', () => {
    const mockColumns: Columns = {
      col1: {
        id: 'col1',
        name: 'col1',
        description: '',
        standardizedVariable: 'stdVar1',
        allValues: ['sub-01', 'sub-02'],
      },
    };

    const mockStdVars: StandardizedVariables = {
      stdVar1: {
        id: 'stdVar1',
        name: 'Participant ID',
        description: '',
        variable_type: VariableType.identifier,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useParticipantIdStatus());
    expect(result.current).toEqual({
      hasMappedParticipantId: true,
      hasMappedOtherColumns: false,
      hasParticipantIdMissingValues: false,
      participantIdColumnName: 'col1',
    });
  });

  it('should return false for isParticipantIDMapped and true for hasMappedOtherColumns when other columns are mapped but participant ID is not', () => {
    const mockColumns: Columns = {
      col1: {
        id: 'col1',
        name: 'col1',
        description: '',
        standardizedVariable: 'stdVar2', // Age
        allValues: ['20', '30'],
      },
    };

    const mockStdVars: StandardizedVariables = {
      stdVar2: {
        id: 'stdVar2',
        name: 'Age',
        description: '',
        variable_type: VariableType.continuous,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useParticipantIdStatus());
    expect(result.current).toEqual({
      hasMappedParticipantId: false,
      hasMappedOtherColumns: true,
      hasParticipantIdMissingValues: false,
      participantIdColumnName: null,
    });
  });

  it('should return true for both when both participant ID and other columns are mapped', () => {
    const mockColumns: Columns = {
      col1: {
        id: 'col1',
        name: 'col1',
        description: '',
        standardizedVariable: 'stdVar2', // Age
        allValues: ['20', '30'],
      },
      col2: {
        id: 'col2',
        name: 'col2',
        description: '',
        standardizedVariable: 'stdVar1', // Participant ID
        allValues: ['sub-01', 'sub-02'],
      },
    };

    const mockStdVars: StandardizedVariables = {
      stdVar1: {
        id: 'stdVar1',
        name: 'Participant ID',
        description: '',
        variable_type: VariableType.identifier,
      },
      stdVar2: {
        id: 'stdVar2',
        name: 'Age',
        description: '',
        variable_type: VariableType.continuous,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useParticipantIdStatus());
    expect(result.current).toEqual({
      hasMappedParticipantId: true,
      hasMappedOtherColumns: true,
      hasParticipantIdMissingValues: false,
      participantIdColumnName: 'col2',
    });
  });

  it('should detect missing values in participant ID column with empty strings', () => {
    const mockColumns: Columns = {
      col1: {
        id: 'col1',
        name: 'participant_id',
        description: '',
        standardizedVariable: 'stdVar1',
        allValues: ['sub-01', '', 'sub-02'],
      },
    };

    const mockStdVars: StandardizedVariables = {
      stdVar1: {
        id: 'stdVar1',
        name: 'Participant ID',
        description: '',
        variable_type: VariableType.identifier,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useParticipantIdStatus());
    expect(result.current.hasParticipantIdMissingValues).toBe(true);
    expect(result.current.participantIdColumnName).toBe('participant_id');
  });

  it('should detect missing values in participant ID column with whitespace values', () => {
    const mockColumns: Columns = {
      col1: {
        id: 'col1',
        name: 'participant_id',
        description: '',
        standardizedVariable: 'stdVar1',
        allValues: ['sub-01', '   ', 'sub-02'],
      },
    };

    const mockStdVars: StandardizedVariables = {
      stdVar1: {
        id: 'stdVar1',
        name: 'Participant ID',
        description: '',
        variable_type: VariableType.identifier,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useParticipantIdStatus());
    expect(result.current.hasParticipantIdMissingValues).toBe(true);
  });

  it('should detect missing values in participant ID column when values are in missingValues', () => {
    const mockColumns: Columns = {
      col1: {
        id: 'col1',
        name: 'participant_id',
        description: '',
        standardizedVariable: 'stdVar1',
        allValues: ['sub-01', 'NA', 'sub-02'],
        missingValues: ['NA'],
      },
    };

    const mockStdVars: StandardizedVariables = {
      stdVar1: {
        id: 'stdVar1',
        name: 'Participant ID',
        description: '',
        variable_type: VariableType.identifier,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useParticipantIdStatus());
    expect(result.current.hasParticipantIdMissingValues).toBe(true);
  });
});
