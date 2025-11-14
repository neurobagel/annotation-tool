import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useColumns } from '~/stores/FreshNewStore';
import type { Columns } from '../../datamodel';
import { useColumnOptionsForMultiColumnMeasureVariable } from './useColumnOptionsForMultiColumnMeasureVariable';
import type { UsePersistedMultiColumnCardsOutput } from './usePersistedMultiColumnCards';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);

describe('useColumnOptionsForMultiColumnMeasureVariable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return column options for the variable', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'Column 1', allValues: [], standardizedVariable: 'var-1' },
      '2': { id: '2', name: 'Column 2', allValues: [], standardizedVariable: 'var-2' },
    };
    const cards: UsePersistedMultiColumnCardsOutput[] = [];

    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() =>
      useColumnOptionsForMultiColumnMeasureVariable('var-1', cards)
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual({ id: '1', label: 'Column 1', disabled: false });
  });

  it('should mark column options as disabled if already mapped', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'Column 1', allValues: [], standardizedVariable: 'var-1' },
      '2': { id: '2', name: 'Column 2', allValues: [], standardizedVariable: 'var-1' },
    };
    const cards: UsePersistedMultiColumnCardsOutput[] = [
      { id: 'card-1', term: null, mappedColumns: ['1'] },
    ];

    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() =>
      useColumnOptionsForMultiColumnMeasureVariable('var-1', cards)
    );

    expect(result.current).toHaveLength(2);
    expect(result.current.find((option) => option.id === '1')?.disabled).toBe(true);
    expect(result.current.find((option) => option.id === '2')?.disabled).toBe(false);
  });

  it('should return empty array when variableId is empty', () => {
    mockedUseColumns.mockReturnValue({});

    const { result } = renderHook(() => useColumnOptionsForMultiColumnMeasureVariable('', []));

    expect(result.current).toEqual([]);
  });
});
