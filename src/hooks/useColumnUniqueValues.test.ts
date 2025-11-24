import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns } from '~/stores/data';
import type { Columns } from '../../internal_types';
import { useColumnUniqueValues } from './useColumnUniqueValues';

vi.mock('~/stores/data', () => ({
  useColumns: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);

describe('useColumnUniqueValues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unique values for a column', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: ['A', 'B', 'A', 'C'] },
    };

    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() => useColumnUniqueValues('1'));

    expect(result.current).toEqual(['A', 'B', 'C']);
  });
});
