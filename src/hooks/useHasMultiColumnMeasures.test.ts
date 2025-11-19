import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';
import type { Columns, StandardizedVariables } from '../../datamodel';
import { useHasMultiColumnMeasures } from './useHasMultiColumnMeasures';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useHasMultiColumnMeasures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when any column is mapped to a multi-column measure variable', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Assessment' },
    };
    const variables: StandardizedVariables = {
      'nb:Assessment': { id: 'nb:Assessment', name: 'Assessment', is_multi_column_measure: true },
    };
    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(variables);

    const { result } = renderHook(() => useHasMultiColumnMeasures());
    expect(result.current).toBe(true);
  });

  it('should return false when columns are mapped but variable is not multi-column', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Age' },
    };
    const variables: StandardizedVariables = {
      'nb:Age': { id: 'nb:Age', name: 'Age', is_multi_column_measure: false },
    };
    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(variables);

    const { result } = renderHook(() => useHasMultiColumnMeasures());
    expect(result.current).toBe(false);
  });

  it('should return false when no columns are mapped to standardized variables', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: null },
    };
    const variables: StandardizedVariables = {
      'nb:Assessment': { id: 'nb:Assessment', name: 'Assessment', is_multi_column_measure: true },
    };
    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(variables);

    const { result } = renderHook(() => useHasMultiColumnMeasures());
    expect(result.current).toBe(false);
  });
});
