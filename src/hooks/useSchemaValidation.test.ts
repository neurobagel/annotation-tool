import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockInvalidDataDictionary, mockDataDictionaryWithAnnotations } from '../utils/mocks';
import { useSchemaValidation } from './useSchemaValidation';

describe('useSchemaValidation', () => {
  it('should return schema valid when dictionary passes validation', () => {
    const { result } = renderHook(() => useSchemaValidation(mockDataDictionaryWithAnnotations));
    expect(result.current.schemaValid).toBe(true);
    expect(result.current.schemaErrors).toEqual([]);
  });

  it('should return errors when dictionary is invalid', () => {
    const { result } = renderHook(() => useSchemaValidation(mockInvalidDataDictionary));
    expect(result.current.schemaValid).toBe(false);
    expect(result.current.schemaErrors.length).toBeGreaterThan(0);
  });
});
