import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns } from '../stores/FreshNewStore';
import {
  mockFreshColumnsAfterDataTableUpload,
  mockFreshDataTableFromColumns,
} from '../utils/mocks';
import { useDataTable } from './useDataTable';

// Mock the store
vi.mock('../stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);

describe('useDataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should transform columns into DataTable format with headers as keys', () => {
    mockedUseColumns.mockReturnValue(mockFreshColumnsAfterDataTableUpload);

    const { result } = renderHook(() => useDataTable());

    expect(result.current).toEqual(mockFreshDataTableFromColumns);
  });

  it('should preserve column order based on numeric column IDs', () => {
    mockedUseColumns.mockReturnValue(mockFreshColumnsAfterDataTableUpload);

    const { result } = renderHook(() => useDataTable());

    const headers = Object.keys(result.current);
    expect(headers).toEqual(['participant_id', 'age', 'sex', 'group_dx', 'group', 'iq']);
  });

  it('should return empty DataTable when columns is empty', () => {
    mockedUseColumns.mockReturnValue({});

    const { result } = renderHook(() => useDataTable());

    expect(result.current).toEqual({});
  });

  it('should handle columns with non-sequential IDs correctly', () => {
    const columnsWithGaps = {
      '0': {
        id: '0',
        name: 'col1',
        allValues: ['a', 'b'],
      },
      '2': {
        id: '2',
        name: 'col3',
        allValues: ['e', 'f'],
      },
      '1': {
        id: '1',
        name: 'col2',
        allValues: ['c', 'd'],
      },
    };

    mockedUseColumns.mockReturnValue(columnsWithGaps);

    const { result } = renderHook(() => useDataTable());

    // Should be ordered by numeric ID: 0, 1, 2
    const headers = Object.keys(result.current);
    expect(headers).toEqual(['col1', 'col2', 'col3']);
    expect(result.current).toEqual({
      col1: ['a', 'b'],
      col2: ['c', 'd'],
      col3: ['e', 'f'],
    });
  });

  it('should handle single column correctly', () => {
    const singleColumn = {
      '0': {
        id: '0',
        name: 'single_column',
        allValues: ['value1', 'value2', 'value3'],
      },
    };

    mockedUseColumns.mockReturnValue(singleColumn);

    const { result } = renderHook(() => useDataTable());

    expect(result.current).toEqual({
      single_column: ['value1', 'value2', 'value3'],
    });
  });

  it('should use column name as key in DataTable', () => {
    const columns = {
      '0': {
        id: '0',
        name: 'my_custom_header',
        allValues: ['x', 'y', 'z'],
      },
    };

    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() => useDataTable());

    expect(result.current).toHaveProperty('my_custom_header');
    expect(result.current.my_custom_header).toEqual(['x', 'y', 'z']);
  });

  it('should handle columns with empty allValues arrays', () => {
    const columnsWithEmptyValues = {
      '0': {
        id: '0',
        name: 'empty_col',
        allValues: [],
      },
      '1': {
        id: '1',
        name: 'another_col',
        allValues: ['data'],
      },
    };

    mockedUseColumns.mockReturnValue(columnsWithEmptyValues);

    const { result } = renderHook(() => useDataTable());

    expect(result.current).toEqual({
      empty_col: [],
      another_col: ['data'],
    });
  });
});
