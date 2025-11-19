import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';
import type { Columns, StandardizedVariables } from '../../datamodel';
import { useColumnStandardizedVariable } from './useColumnStandardizedVariable';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useColumnStandardizedVariable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return standardized variable metadata with multi-column flag', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: 'nb:Measure' },
    };
    const standardizedVariables: StandardizedVariables = {
      'nb:Measure': {
        id: 'nb:Measure',
        name: 'Measure',
        is_multi_column_measure: true,
      },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(standardizedVariables);

    const { result } = renderHook(() => useColumnStandardizedVariable('1'));

    expect(result.current).not.toBeNull();
    expect(result.current?.standardizedVariableId).toBe('nb:Measure');
    expect(result.current?.standardizedVariable.name).toBe('Measure');
    expect(result.current?.isMultiColumnMeasure).toBe(true);
  });

  it('should return null when column has no standardized variable assigned', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'col1', allValues: [], standardizedVariable: null },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue({});

    const { result } = renderHook(() => useColumnStandardizedVariable('1'));

    expect(result.current).toBeNull();
  });
});
