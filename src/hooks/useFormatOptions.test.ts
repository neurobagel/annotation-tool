import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStandardizedFormats } from '~/stores/data';
import type { StandardizedFormats } from '../utils/internal_types';
import { useFormatOptions } from './useFormatOptions';

vi.mock('~/stores/data', () => ({
  useStandardizedFormats: vi.fn(),
}));

const mockedUseStandardizedFormats = vi.mocked(useStandardizedFormats);

describe('useFormatOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return format options for a standardized variable', () => {
    const formats: StandardizedFormats = {
      'nb:FromFloat': {
        identifier: 'nb:FromFloat',
        label: 'decimal',
        examples: ['1.23'],
        standardizedVariableId: 'nb:Age',
      },
      'nb:FromEuro': {
        identifier: 'nb:FromEuro',
        label: 'European decimal',
        standardizedVariableId: 'nb:Age',
      },
      'nb:Other': {
        identifier: 'nb:Other',
        label: 'Other',
        standardizedVariableId: 'nb:OtherVar',
      },
    };

    mockedUseStandardizedFormats.mockReturnValue(formats);

    const { result } = renderHook(() => useFormatOptions('nb:Age'));

    expect(result.current).toEqual([
      { id: 'nb:FromFloat', label: 'decimal', examples: ['1.23'] },
      { id: 'nb:FromEuro', label: 'European decimal', examples: undefined },
    ]);
  });
});
