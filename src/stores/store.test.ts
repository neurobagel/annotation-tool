import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useStore from './store';
import { mockDataTable } from '../utils/mocks';

describe('store actions', () => {
  it('should set currentView', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setCurrentView('upload');
    });
    expect(result.current.currentView).toBe('upload');
  });

  it('should set dataTable', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setDataTable(mockDataTable);
    });
    expect(result.current.dataTable).toEqual(mockDataTable);
  });

  it('should initialize columns', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.initializeColumns(mockDataTable);
    });
    expect(result.current.columns).toEqual(mockDataTable);
  });
});
