import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useColumns, useStandardizedTerms } from '~/stores/FreshNewStore';
import type { Columns, StandardizedTerms } from '../../datamodel';
import { useColumnOptionsForMultiColumnMeasureVariable } from './useColumnOptionsForMultiColumnMeasureVariable';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedTerms: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('useColumnOptionsForMultiColumnMeasureVariable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return column options for the variable', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'Column 1', allValues: [], standardizedVariable: 'var-1' },
      '2': { id: '2', name: 'Column 2', allValues: [], standardizedVariable: 'var-2' },
    };
    const terms: StandardizedTerms = {};

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedTerms.mockReturnValue(terms);

    const { result } = renderHook(() => useColumnOptionsForMultiColumnMeasureVariable('var-1'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual({
      id: '1',
      label: 'Column 1',
      isPartOfCollection: false,
    });
  });

  it('should mark column options as disabled if already mapped to a collection term', () => {
    const columns: Columns = {
      '1': {
        id: '1',
        name: 'Column 1',
        allValues: [],
        standardizedVariable: 'var-1',
        isPartOf: 'term-1',
      },
      '2': { id: '2', name: 'Column 2', allValues: [], standardizedVariable: 'var-1' },
    };
    const terms: StandardizedTerms = {
      'term-1': {
        id: 'term-1',
        label: 'Term 1',
        standardizedVariableId: 'var-1',
        isCollection: true,
      },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedTerms.mockReturnValue(terms);

    const { result } = renderHook(() => useColumnOptionsForMultiColumnMeasureVariable('var-1'));

    expect(result.current).toHaveLength(2);
    expect(result.current.find((option) => option.id === '1')?.isPartOfCollection).toBe(true);
    expect(result.current.find((option) => option.id === '2')?.isPartOfCollection).toBe(false);
  });

  it('should return empty array when variableId is empty', () => {
    mockedUseColumns.mockReturnValue({});
    mockedUseStandardizedTerms.mockReturnValue({});

    const { result } = renderHook(() => useColumnOptionsForMultiColumnMeasureVariable(''));

    expect(result.current).toEqual([]);
  });
});
