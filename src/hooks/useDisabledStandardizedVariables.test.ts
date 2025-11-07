import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';
import { mockFreshStandardizedVariables } from '~/utils/mocks';
import { useDisabledStandardizedVariables } from './useDisabledStandardizedVariables';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useDisabledStandardizedVariables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty set when no columns are mapped', () => {
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

    const { result } = renderHook(() => useDisabledStandardizedVariables());

    expect(result.current).toBeInstanceOf(Set);
    expect(result.current.size).toBe(0);
  });

  it('should return an empty set when columns are mapped to multi-column variables', () => {
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

    const { result } = renderHook(() => useDisabledStandardizedVariables());

    expect(result.current.size).toBe(0);
  });

  it('should return an empty set when columns are mapped to variables that can have multiple columns', () => {
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

    const { result } = renderHook(() => useDisabledStandardizedVariables());

    expect(result.current.size).toBe(0);
  });

  it('should return disabled labels only for single-column variables', () => {
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

    const { result } = renderHook(() => useDisabledStandardizedVariables());

    expect(result.current.size).toBe(2);
    expect(result.current.has('Participant ID')).toBe(true);
    expect(result.current.has('Age')).toBe(true);
    expect(result.current.has('Diagnosis')).toBe(false);
    expect(result.current.has('Assessment Tool')).toBe(false);
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

    const { result } = renderHook(() => useDisabledStandardizedVariables());

    expect(result.current.size).toBe(1);
    expect(result.current.has('Participant ID')).toBe(true);
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

    const { result } = renderHook(() => useDisabledStandardizedVariables());

    expect(result.current.size).toBe(1);
    expect(result.current.has('Participant ID')).toBe(true);
  });

  it('should return empty set when standardizedVariables is empty', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'column1',
        allValues: [],
        standardizedVariable: 'nb:ParticipantID',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue({});

    const { result } = renderHook(() => useDisabledStandardizedVariables());

    expect(result.current.size).toBe(0);
  });
});
