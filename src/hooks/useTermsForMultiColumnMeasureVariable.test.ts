import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStandardizedTerms } from '~/stores/data';
import type { StandardizedTerms } from '../utils/internal_types';
import { useTermsForMultiColumnMeasureVariable } from './useTermsForMultiColumnMeasureVariable';

vi.mock('~/stores/data', () => ({
  useStandardizedTerms: vi.fn(),
}));

const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('useTermsForMultiColumnMeasureVariable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return terms for a variable with disabled reflecting collectionCreatedAt', () => {
    const terms: StandardizedTerms = {
      'term-1': {
        id: 'term-1',
        label: 'Term 1',
        standardizedVariableId: 'var-1',
        collectionCreatedAt: '1',
      },
      'term-2': {
        id: 'term-2',
        label: 'Term 2',
        standardizedVariableId: 'var-1',
        description: 'desc 2',
        collectionCreatedAt: undefined,
      },
      'term-3': {
        id: 'term-3',
        label: 'Term 3',
        standardizedVariableId: 'var-2',
        collectionCreatedAt: undefined,
      },
    };
    mockedUseStandardizedTerms.mockReturnValue(terms);

    const { result } = renderHook(() => useTermsForMultiColumnMeasureVariable('var-1'));

    expect(result.current).toHaveLength(2);
    expect(result.current.find((term) => term.id === 'term-1')?.disabled).toBe(true);
    expect(result.current.find((term) => term.id === 'term-2')?.disabled).toBe(false);
    expect(result.current.find((term) => term.id === 'term-2')?.description).toBe('desc 2');
  });

  it('should return empty array when variableId is empty', () => {
    mockedUseStandardizedTerms.mockReturnValue({});

    const { result } = renderHook(() => useTermsForMultiColumnMeasureVariable(''));

    expect(result.current).toEqual([]);
  });
});
