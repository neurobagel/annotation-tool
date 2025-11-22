import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';
import type { Columns, StandardizedVariables } from '../../datamodel';
import { useAnnotatedVariables } from './useAnnotatedVariables';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useAnnotatedVariables', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should group columns by standardized variable and flags multi-column measures', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Assessment' },
      '2': { id: '2', name: 'col2', allValues: [], standardizedVariable: 'nb:Assessment' },
      '3': { id: '3', name: 'col3', allValues: [], standardizedVariable: 'nb:Age' },
    };

    const standardizedVariables: StandardizedVariables = {
      'nb:Assessment': { id: 'nb:Assessment', name: 'Assessment', is_multi_column_measure: true },
      'nb:Age': { id: 'nb:Age', name: 'Age', is_multi_column_measure: false },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(standardizedVariables);

    const { result } = renderHook(() => useAnnotatedVariables());

    expect(result.current).toHaveLength(2);

    const assessmentGroup = result.current.find(
      (group) => group.standardizedVariableId === 'nb:Assessment'
    );
    expect(assessmentGroup?.columnIds).toEqual(['1', '2']);
    expect(assessmentGroup?.isMultiColumnMeasure).toBe(true);

    const ageGroup = result.current.find((group) => group.standardizedVariableId === 'nb:Age');
    expect(ageGroup?.columnIds).toEqual(['3']);
    expect(ageGroup?.isMultiColumnMeasure).toBe(false);
  });

  it('should return empty array when no columns are annotated', () => {
    mockedUseColumns.mockReturnValue({});
    mockedUseStandardizedVariables.mockReturnValue({});

    const { result } = renderHook(() => useAnnotatedVariables());

    expect(result.current).toEqual([]);
  });
});
