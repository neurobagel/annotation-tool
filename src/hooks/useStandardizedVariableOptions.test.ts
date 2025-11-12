import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';
import { mockFreshStandardizedVariables } from '~/utils/mocks';
import { useStandardizedVariableOptions } from './useStandardizedVariableOptions';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useStandardizedVariableOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return options enabled when no columns are mapped', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'column1',
        allValues: [],
      },
      '2': {
        id: '2',
        name: 'column2',
        allValues: [],
      },
    });
    mockedUseStandardizedVariables.mockReturnValue(mockFreshStandardizedVariables);

    const { result } = renderHook(() => useStandardizedVariableOptions());

    expect(result.current).toHaveLength(Object.keys(mockFreshStandardizedVariables).length);
    expect(result.current.every((option) => option.disabled === false)).toBe(true);
  });

  it('should return options enabled when columns are mapped to Collections variables', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'column1',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
      },
      '2': {
        id: '2',
        name: 'column2',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue(mockFreshStandardizedVariables);

    const { result } = renderHook(() => useStandardizedVariableOptions());

    expect(result.current.find((option) => option.id === 'nb:Assessment')?.disabled).toBe(false);
  });

  it('should return options enabled when columns are mapped to variables that can have multiple columns', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'column1',
        allValues: [],
        standardizedVariable: 'nb:Diagnosis',
      },
      '2': {
        id: '2',
        name: 'column2',
        allValues: [],
        standardizedVariable: 'nb:Diagnosis',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue(mockFreshStandardizedVariables);

    const { result } = renderHook(() => useStandardizedVariableOptions());

    expect(result.current.find((option) => option.id === 'nb:Diagnosis')?.disabled).toBe(false);
  });

  it('should return disabled options only for single-column variables', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'participant_id',
        allValues: [],
        standardizedVariable: 'nb:ParticipantID',
      },
      '2': {
        id: '2',
        name: 'diagnosis1',
        allValues: [],
        standardizedVariable: 'nb:Diagnosis',
      },
      '3': {
        id: '3',
        name: 'assessment1',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
      },
      '4': {
        id: '4',
        name: 'age',
        allValues: [],
        standardizedVariable: 'nb:Age',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue(mockFreshStandardizedVariables);

    const { result } = renderHook(() => useStandardizedVariableOptions());

    expect(result.current.filter((option) => option.disabled).length).toBe(2);
    expect(result.current.find((option) => option.id === 'nb:ParticipantID')?.disabled).toBe(true);
    expect(result.current.find((option) => option.id === 'nb:Age')?.disabled).toBe(true);
    expect(result.current.find((option) => option.id === 'nb:Diagnosis')?.disabled).toBe(false);
    expect(result.current.find((option) => option.id === 'nb:Assessment')?.disabled).toBe(false);
  });

  it('should handle columns with invalid standardizedVariable IDs gracefully', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'column1',
        allValues: [],
        standardizedVariable: 'nb:NonExistent',
      },
      '2': {
        id: '2',
        name: 'participant_id',
        allValues: [],
        standardizedVariable: 'nb:ParticipantID',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue(mockFreshStandardizedVariables);

    const { result } = renderHook(() => useStandardizedVariableOptions());

    expect(result.current.filter((option) => option.disabled).length).toBe(1);
    expect(result.current.find((option) => option.id === 'nb:ParticipantID')?.disabled).toBe(true);
  });

  it('should handle columns with null standardizedVariable', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'column1',
        allValues: [],
        standardizedVariable: null,
      },
      '2': {
        id: '2',
        name: 'participant_id',
        allValues: [],
        standardizedVariable: 'nb:ParticipantID',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue(mockFreshStandardizedVariables);

    const { result } = renderHook(() => useStandardizedVariableOptions());

    expect(result.current.filter((option) => option.disabled).length).toBe(1);
    expect(result.current.find((option) => option.id === 'nb:ParticipantID')?.disabled).toBe(true);
  });

  it('should return empty array when standardizedVariables is empty', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'column1',
        allValues: [],
        standardizedVariable: 'nb:ParticipantID',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue({});

    const { result } = renderHook(() => useStandardizedVariableOptions());

    expect(result.current).toEqual([]);
  });
});
