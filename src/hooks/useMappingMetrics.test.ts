import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dataStore from '~/stores/data';
import type { Column } from '~/utils/internal_types';
import { useMappingMetrics } from './useMappingMetrics';

vi.mock('~/stores/data', () => ({
  useColumns: vi.fn(),
}));

describe('useMappingMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return zeros and empty objects when no columns are present', () => {
    vi.mocked(dataStore.useColumns).mockReturnValue({});

    const { result } = renderHook(() => useMappingMetrics());

    expect(result.current).toEqual({
      totalColumnsCount: 0,
      annotatedColumnsCount: 0,
      mappedVariableCounts: {},
      mappedTermCounts: {},
    });
  });

  it('should calculate metrics correctly for mapped and unmapped columns', () => {
    vi.mocked(dataStore.useColumns).mockReturnValue({
      col1: { id: 'col1', name: 'Column 1', allValues: [] } as unknown as Column, // unmapped
      col2: {
        id: 'col2',
        name: 'Column 2',
        allValues: [],
        standardizedVariable: 'var1',
      } as Column,
      col3: {
        id: 'col3',
        name: 'Column 3',
        allValues: [],
        standardizedVariable: 'var1',
      } as Column,
      col4: {
        id: 'col4',
        name: 'Column 4',
        allValues: [],
        isPartOf: 'term1',
        standardizedVariable: 'var2',
      } as Column,
    });

    const { result } = renderHook(() => useMappingMetrics());

    expect(result.current).toEqual({
      totalColumnsCount: 4,
      annotatedColumnsCount: 3,
      mappedVariableCounts: {
        var1: 2,
        var2: 1,
      },
      mappedTermCounts: {
        term1: 1,
      },
    });
  });
});
