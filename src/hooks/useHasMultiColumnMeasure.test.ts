import { describe, it, expect } from 'vitest';
import { useHasMultiColumnMeasure } from './useHasMultiColumnMeasure';

describe('useHasMultiColumnMeasure', () => {
  it('returns true', () => {
    const result = useHasMultiColumnMeasure();
    expect(result).toBe(true);
  });
});
