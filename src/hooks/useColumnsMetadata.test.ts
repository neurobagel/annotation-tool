import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataType, type Columns } from '../../datamodel';
import { useColumns } from '../stores/FreshNewStore';
import { useColumnsMetadata } from './useColumnsMetadata';

vi.mock('../stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);

describe('useColumnsMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return metadata for the requested columns', () => {
    const columns = {
      '1': { id: '1', name: 'age', allValues: [], dataType: DataType.continuous },
      '2': { id: '2', name: 'sex', allValues: [], dataType: DataType.categorical },
    } satisfies Columns;

    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() => useColumnsMetadata(['1', '2']));

    expect(result.current).toEqual({
      '1': { id: '1', name: 'age', dataType: DataType.continuous },
      '2': { id: '2', name: 'sex', dataType: DataType.categorical },
    });
  });

  it('should skip unknown column IDs', () => {
    mockedUseColumns.mockReturnValue({
      '1': { id: '1', name: 'age', allValues: [], dataType: DataType.continuous },
    } as Columns);

    const { result } = renderHook(() => useColumnsMetadata(['1', 'missing']));

    expect(result.current).toEqual({
      '1': { id: '1', name: 'age', dataType: DataType.continuous },
    });
  });
});
