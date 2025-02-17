import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useDataStore from './data';
import { mockHeaders, mockDataTable } from '../utils/mocks';

describe('store actions', () => {
  it('should set dataTable', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.setDataTable(mockDataTable);
    });
    expect(result.current.dataTable).toEqual(mockDataTable);
  });

  it('should initialize columns', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.initializeColumns(mockHeaders);
    });
    expect(result.current.columns).toEqual(mockHeaders);
  });
});
