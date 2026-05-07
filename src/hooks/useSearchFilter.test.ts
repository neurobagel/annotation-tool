import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSearchFilter } from './useSearchFilter';

describe('useSearchFilter', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty search term', () => {
    const { result } = renderHook(() => useSearchFilter());
    expect(result.current.searchTerm).toBe('');
    expect(result.current.debouncedSearchTerm).toBe('');
  });

  it('should update searchTerm immediately but debounce debouncedSearchTerm', () => {
    const { result } = renderHook(() => useSearchFilter(300));

    act(() => {
      result.current.setSearchTerm('hello');
    });

    expect(result.current.searchTerm).toBe('hello');
    expect(result.current.debouncedSearchTerm).toBe('');
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.debouncedSearchTerm).toBe('hello');
  });

  it('should clear the search term', () => {
    const { result } = renderHook(() => useSearchFilter(300));

    act(() => {
      result.current.setSearchTerm('hello');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedSearchTerm).toBe('hello');

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchTerm).toBe('');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedSearchTerm).toBe('');
  });
});
