import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as dataStore from '../stores/data';
import { Column, StandardizedVariable, VariableType } from '../utils/internal_types';
import { useIsParticipantIDMapped } from './useIsParticipantIDMapped';

vi.mock('../stores/data', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

describe('useIsParticipantIDMapped', () => {
  it('returns false for both when no columns are mapped', () => {
    vi.mocked(dataStore.useColumns).mockReturnValue({});
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue({});

    const { result } = renderHook(() => useIsParticipantIDMapped());
    expect(result.current).toEqual({ hasMappedParticipantId: false, hasMappedOtherColumns: false });
  });

  it('returns true for isParticipantIDMapped and false for hasMappedOtherColumns when only participant ID is mapped', () => {
    const mockColumns: Record<string, Column> = {
      col1: {
        id: 'col1',
        name: 'col1',
        description: '',
        standardizedVariable: 'stdVar1',
        allValues: [],
      },
    };

    const mockStdVars: Record<string, StandardizedVariable> = {
      stdVar1: {
        id: 'stdVar1',
        name: 'Participant ID',
        description: '',
        variable_type: VariableType.continuous,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useIsParticipantIDMapped());
    expect(result.current).toEqual({ hasMappedParticipantId: true, hasMappedOtherColumns: false });
  });

  it('returns false for isParticipantIDMapped and true for hasMappedOtherColumns when other columns are mapped but participant ID is not', () => {
    const mockColumns: Record<string, Column> = {
      col1: {
        id: 'col1',
        name: 'col1',
        description: '',
        standardizedVariable: 'stdVar2', // Age
        allValues: [],
      },
    };

    const mockStdVars: Record<string, StandardizedVariable> = {
      stdVar2: {
        id: 'stdVar2',
        name: 'Age',
        description: '',
        variable_type: VariableType.continuous,
      },
    };

    vi.mocked(dataStore.useColumns).mockReturnValue(mockColumns);
    vi.mocked(dataStore.useStandardizedVariables).mockReturnValue(mockStdVars);

    const { result } = renderHook(() => useIsParticipantIDMapped());
    expect(result.current).toEqual({ hasMappedParticipantId: false, hasMappedOtherColumns: true });
  });

  it('returns true for both when both participant ID and other columns are mapped', () => {
    const mockColumns: Record<string, Column> = {
      col1: {
        id: 'col1',
        name: 'col1',
        description: '',
        standardizedVariable: 'stdVar2', // Age
        allValues: [],
      },
      col2: {
        id: 'col2',
        name: 'col2',
        description: '',
        standardizedVariable: 'stdVar1', // Participant ID
        allValues: [],
      },
    };

    const mockStdVars: Record<string, StandardizedVariable> = {
      stdVar1: {
        id: 'stdVar1',
        name: 'Participant ID',
        description: '',
        variable_type: VariableType.continuous,
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

    const { result } = renderHook(() => useIsParticipantIDMapped());
    expect(result.current).toEqual({ hasMappedParticipantId: true, hasMappedOtherColumns: true });
  });
});
