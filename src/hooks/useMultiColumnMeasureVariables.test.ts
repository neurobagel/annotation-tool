import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';
import type { Columns, StandardizedVariables } from '../../datamodel';
import { useMultiColumnMeasureVariables } from './useMultiColumnMeasureVariables';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useMultiColumnMeasureVariables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return multi-column variables that have mapped columns', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Assessment' },
      '2': { id: '2', name: 'col2', allValues: [], standardizedVariable: 'nb:Age' },
    };
    const variables: StandardizedVariables = {
      'nb:Assessment': { id: 'nb:Assessment', name: 'Assessment', is_multi_column_measure: true },
      'nb:Age': { id: 'nb:Age', name: 'Age', is_multi_column_measure: false },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(variables);

    const { result } = renderHook(() => useMultiColumnMeasureVariables());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('nb:Assessment');
  });

  it('should deduplicate variables even if multiple columns map to the same variable', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Assessment' },
      '2': { id: '2', name: 'col2', allValues: [], standardizedVariable: 'nb:Assessment' },
    };
    const variables: StandardizedVariables = {
      'nb:Assessment': { id: 'nb:Assessment', name: 'Assessment', is_multi_column_measure: true },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(variables);

    const { result } = renderHook(() => useMultiColumnMeasureVariables());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('nb:Assessment');
  });

  it('should return an empty list when no multi-column variables are mapped', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Age' },
      '2': { id: '2', name: 'col2', allValues: [], standardizedVariable: null },
    };
    const variables: StandardizedVariables = {
      'nb:Age': { id: 'nb:Age', name: 'Age', is_multi_column_measure: false },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(variables);

    const { result } = renderHook(() => useMultiColumnMeasureVariables());

    expect(result.current).toHaveLength(0);
  });
});
