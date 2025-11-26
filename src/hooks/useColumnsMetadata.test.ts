import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '../stores/data';
import { DataType, type Columns } from '../utils/internal_types';
import { useColumnsMetadata } from './useColumnsMetadata';

vi.mock('../stores/data', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useColumnsMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return metadata for the requested columns', () => {
    const columns = {
      '1': { id: '1', name: 'age', allValues: [], dataType: DataType.continuous },
      '2': {
        id: '2',
        name: 'sex',
        allValues: [],
        dataType: DataType.categorical,
        standardizedVariable: 'nb:Assessment',
      },
    } satisfies Columns;

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Assessment': {
        id: 'nb:Assessment',
        name: 'Assessment Tool',
        is_multi_column_measure: true,
      },
    });

    const { result } = renderHook(() => useColumnsMetadata(['1', '2']));

    expect(result.current).toEqual({
      '1': { id: '1', name: 'age', dataType: DataType.continuous, isMultiColumnMeasure: false },
      '2': { id: '2', name: 'sex', dataType: DataType.categorical, isMultiColumnMeasure: true },
    });
  });

  it('should skip unknown column IDs', () => {
    mockedUseColumns.mockReturnValue({
      '1': { id: '1', name: 'age', allValues: [], dataType: DataType.continuous },
    } as Columns);

    const { result } = renderHook(() => useColumnsMetadata(['1', 'missing']));

    expect(result.current).toEqual({
      '1': { id: '1', name: 'age', dataType: DataType.continuous, isMultiColumnMeasure: false },
    });
  });
});
