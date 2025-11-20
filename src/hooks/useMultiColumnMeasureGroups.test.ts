import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedTerms } from '~/stores/FreshNewStore';
import type { Columns, StandardizedTerms } from '../../datamodel';
import { useMultiColumnMeasureGroups } from './useMultiColumnMeasureGroups';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedTerms: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('useMultiColumnMeasureGroups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should group columns by isPartOf term label', () => {
    const columns: Columns = {
      '1': {
        id: '1',
        name: 'col1',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
        isPartOf: 'term:1',
      },
      '2': {
        id: '2',
        name: 'col2',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
        isPartOf: 'term:1',
      },
      '3': {
        id: '3',
        name: 'col3',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
        isPartOf: 'term:2',
      },
      '4': { id: '4', name: 'col4', allValues: [], standardizedVariable: 'nb:Other' },
    };

    const terms: StandardizedTerms = {
      'term:1': { id: 'term:1', label: 'Group 1', standardizedVariableId: 'nb:Assessment' },
      'term:2': { id: 'term:2', label: 'Group 2', standardizedVariableId: 'nb:Assessment' },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedTerms.mockReturnValue(terms);

    const { result } = renderHook(() => useMultiColumnMeasureGroups('nb:Assessment'));

    expect(result.current).toHaveLength(2);
    const group1 = result.current.find((group) => group.termId === 'term:1');
    expect(group1?.label).toBe('Group 1');
    expect(group1?.columnIds).toEqual(['1', '2']);

    const group2 = result.current.find((group) => group.termId === 'term:2');
    expect(group2?.label).toBe('Group 2');
    expect(group2?.columnIds).toEqual(['3']);
  });

  it('should group columns without isPartOf under Ungrouped', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Assessment' },
      '2': {
        id: '2',
        name: 'col2',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
        isPartOf: undefined,
      },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedTerms.mockReturnValue({});

    const { result } = renderHook(() => useMultiColumnMeasureGroups('nb:Assessment'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].termId).toBeNull();
    expect(result.current[0].label).toBe('Ungrouped');
    expect(result.current[0].columnIds).toEqual(['1', '2']);
  });
});
