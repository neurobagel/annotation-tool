import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedTerms } from '~/stores/data';
import type { Columns, StandardizedTerms } from '../utils/internal_types';
import { usePersistedMultiColumnCards } from './usePersistedMultiColumnCards';

vi.mock('~/stores/data', () => ({
  useColumns: vi.fn(),
  useStandardizedTerms: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('usePersistedMultiColumnCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return cards from terms marked as collections', () => {
    const terms: StandardizedTerms = {
      'term-1': {
        id: 'term-1',
        label: 'Term 1',
        standardizedVariableId: 'var-1',
        isCollection: true,
      },
      'term-2': {
        id: 'term-2',
        label: 'Term 2',
        standardizedVariableId: 'var-1',
        isCollection: false,
      },
    };
    const columns: Columns = {};

    mockedUseStandardizedTerms.mockReturnValue(terms);
    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() => usePersistedMultiColumnCards('var-1'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('term-1');
    expect(result.current[0].mappedColumns).toEqual([]);
  });

  it('should attach columns whose isPartOf references a term', () => {
    const terms: StandardizedTerms = {
      'term-1': {
        id: 'term-1',
        label: 'Term 1',
        standardizedVariableId: 'var-1',
        isCollection: true,
      },
    };
    const columns: Columns = {
      'col-1': {
        id: 'col-1',
        name: 'Column 1',
        allValues: [],
        standardizedVariable: 'var-1',
        isPartOf: 'term-1',
      },
    };

    mockedUseStandardizedTerms.mockReturnValue(terms);
    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() => usePersistedMultiColumnCards('var-1'));

    expect(result.current[0].mappedColumns).toEqual(['col-1']);
  });

  it('should ignore columns that belong to other variables or missing terms', () => {
    const terms: StandardizedTerms = {
      'term-1': {
        id: 'term-1',
        label: 'Term 1',
        standardizedVariableId: 'var-1',
        isCollection: true,
      },
    };
    const columns: Columns = {
      'col-1': {
        id: 'col-1',
        name: 'Column 1',
        allValues: [],
        standardizedVariable: 'var-2',
        isPartOf: 'term-1',
      },
      'col-2': {
        id: 'col-2',
        name: 'Column 2',
        allValues: [],
        standardizedVariable: 'var-1',
        isPartOf: 'term-unknown',
      },
    };

    mockedUseStandardizedTerms.mockReturnValue(terms);
    mockedUseColumns.mockReturnValue(columns);

    const { result } = renderHook(() => usePersistedMultiColumnCards('var-1'));

    expect(result.current[0].mappedColumns).toEqual([]);
  });
});
