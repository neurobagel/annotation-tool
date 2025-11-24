import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  mockFreshInvalidDataDictionary,
  mockFreshDataDictionaryWithAnnotations,
} from '../utils/freshMocks';
import { useSchemaValidation } from './useSchemaValidation';

describe('useSchemaValidation', () => {
  it('should return schema valid when dictionary passes validation', () => {
    const { result } = renderHook(() =>
      useSchemaValidation(mockFreshDataDictionaryWithAnnotations)
    );
    expect(result.current.schemaValid).toBe(true);
    expect(result.current.schemaErrors).toEqual([]);
  });

  it('should return errors when dictionary is invalid', () => {
    const { result } = renderHook(() => useSchemaValidation(mockFreshInvalidDataDictionary));
    expect(result.current.schemaValid).toBe(false);
    expect(result.current.schemaErrors.length).toBeGreaterThan(0);
  });
});
