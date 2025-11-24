import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStandardizedTerms } from '~/stores/data';
import type { StandardizedTerms } from '../../internal_types';
import { useTermOptions } from './useTermOptions';

vi.mock('~/stores/data', () => ({
  useStandardizedTerms: vi.fn(),
}));

const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('useTermOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return term options for a standardized variable', () => {
    const terms: StandardizedTerms = {
      'nb:Male': {
        id: 'nb:Male',
        label: 'Male',
        standardizedVariableId: 'nb:Sex',
      },
      'nb:Female': {
        id: 'nb:Female',
        label: 'Female',
        standardizedVariableId: 'nb:Sex',
        abbreviation: 'F',
      },
      'nb:AgeTerm': {
        id: 'nb:AgeTerm',
        label: 'AgeTerm',
        standardizedVariableId: 'nb:Age',
      },
    };

    mockedUseStandardizedTerms.mockReturnValue(terms);

    const { result } = renderHook(() => useTermOptions('nb:Sex'));

    expect(result.current).toEqual([
      { id: 'nb:Male', label: 'Male', abbreviation: undefined },
      { id: 'nb:Female', label: 'Female', abbreviation: 'F' },
    ]);
  });
});
