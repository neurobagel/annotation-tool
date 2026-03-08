import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStandardizedItemDetails } from './useStandardizedItemDetails';
import * as useStandardizedVariableItemsModule from './useStandardizedVariableItems';

describe('useStandardizedItemDetails', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null when itemId is null', () => {
    vi.spyOn(useStandardizedVariableItemsModule, 'useStandardizedVariableItems').mockReturnValue({
      demographicVariables: [],
      collectionVariables: [],
    });

    const { result } = renderHook(() => useStandardizedItemDetails(null));

    expect(result.current).toBeNull();
  });

  it('should return demographic variable details when itemId matches a demographic variable', () => {
    vi.spyOn(useStandardizedVariableItemsModule, 'useStandardizedVariableItems').mockReturnValue({
      demographicVariables: [
        { id: 'var1', label: 'Age' },
        { id: 'var2', label: 'Sex' },
      ],
      collectionVariables: [],
    });

    const { result } = renderHook(() => useStandardizedItemDetails('var1'));

    expect(result.current).toEqual({
      type: 'variable',
      id: 'var1',
      label: 'Age',
    });
  });

  it('should return term details when itemId matches a term inside a collection', () => {
    vi.spyOn(useStandardizedVariableItemsModule, 'useStandardizedVariableItems').mockReturnValue({
      demographicVariables: [{ id: 'var1', label: 'Age' }],
      collectionVariables: [
        {
          id: 'col1',
          label: 'Assessment',
          terms: [
            { id: 'termA', label: 'Score A' },
            { id: 'termB', label: 'Score B' },
          ],
        },
      ],
    });

    const { result } = renderHook(() => useStandardizedItemDetails('termB'));

    expect(result.current).toEqual({
      type: 'term',
      id: 'termB',
      label: 'Score B',
    });
  });

  it('should return null when itemId does not match any variable or term', () => {
    vi.spyOn(useStandardizedVariableItemsModule, 'useStandardizedVariableItems').mockReturnValue({
      demographicVariables: [{ id: 'var1', label: 'Age' }],
      collectionVariables: [
        {
          id: 'col1',
          label: 'Assessment',
          terms: [{ id: 'termA', label: 'Score A' }],
        },
      ],
    });

    const { result } = renderHook(() => useStandardizedItemDetails('non-existent-id'));

    expect(result.current).toBeNull();
  });
});
