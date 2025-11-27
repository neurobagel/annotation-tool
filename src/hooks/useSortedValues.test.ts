import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSortedValues } from './useSortedValues';

describe('useSortedValues', () => {
  it('should sort categorical values alphabetically ascending', () => {
    const { result } = renderHook(() =>
      useSortedValues(['banana', 'apple', 'cherry'], [], 'value', 'asc')
    );

    expect(result.current.sortedValues).toEqual(['apple', 'banana', 'cherry']);
  });

  it('should sort categorical values alphabetically descending', () => {
    const { result } = renderHook(() =>
      useSortedValues(['banana', 'apple', 'cherry'], [], 'value', 'desc')
    );

    expect(result.current.sortedValues).toEqual(['cherry', 'banana', 'apple']);
  });

  it('should sort continuous values ascending', () => {
    const { result } = renderHook(() =>
      useSortedValues(['10', '2', '3.5', '0'], [], 'value', 'asc')
    );

    expect(result.current.sortedValues).toEqual(['0', '2', '3.5', '10']);
  });

  it('should sort continuous values descending', () => {
    const { result } = renderHook(() =>
      useSortedValues(['10', '2', '3.5', '0'], [], 'value', 'desc')
    );

    expect(result.current.sortedValues).toEqual(['10', '3.5', '2', '0']);
  });

  it('should place missing values first when sorting by missing ascending', () => {
    const { result } = renderHook(() =>
      useSortedValues(['val', 'missing', 'N/A'], ['missing'], 'missing', 'asc')
    );

    expect(result.current.sortedValues).toEqual(['missing', 'N/A', 'val']);
  });

  it('should place missing values last when sorting by missing descending', () => {
    const { result } = renderHook(() =>
      useSortedValues(['val', 'missing', 'N/A'], ['missing'], 'missing', 'desc')
    );

    expect(result.current.sortedValues).toEqual(['N/A', 'val', 'missing']);
  });
});
