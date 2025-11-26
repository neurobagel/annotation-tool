import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useTablePagination } from './useTablePagination';

describe('useTablePagination', () => {
  it('should initialize pagination state', () => {
    const { result } = renderHook(() => useTablePagination(5));
    expect(result.current.page).toBe(0);
    expect(result.current.rowsPerPage).toBe(5);
  });

  it('should update page via handleChangePage', () => {
    const { result } = renderHook(() => useTablePagination(5));
    act(() => {
      result.current.handleChangePage(null, 2);
    });
    expect(result.current.page).toBe(2);
  });

  it('should update rows per page and resets page', () => {
    const { result } = renderHook(() => useTablePagination(5));
    act(() => {
      result.current.handleChangePage(null, 3);
    });
    expect(result.current.page).toBe(3);
    act(() => {
      result.current.handleChangeRowsPerPage({
        target: { value: '10' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.rowsPerPage).toBe(10);
    expect(result.current.page).toBe(0);
  });
});
