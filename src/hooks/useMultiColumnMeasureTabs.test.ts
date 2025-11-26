import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { StandardizedVariable } from '../utils/internal_types';
import { useMultiColumnMeasureTabs } from './useMultiColumnMeasureTabs';
import { useMultiColumnMeasureVariables } from './useMultiColumnMeasureVariables';

vi.mock('./useMultiColumnMeasureVariables', () => ({
  useMultiColumnMeasureVariables: vi.fn(),
}));

const mockedUseMultiColumnMeasureVariables = vi.mocked(useMultiColumnMeasureVariables);

const some: StandardizedVariable = { id: 'nb:Some', name: 'Some' };
const other: StandardizedVariable = { id: 'nb:Other', name: 'Other' };

describe('useMultiColumnMeasureTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should expose variables and default to the first tab', () => {
    mockedUseMultiColumnMeasureVariables.mockReturnValue([some, other]);
    const { result } = renderHook(() => useMultiColumnMeasureTabs());

    expect(result.current.variables).toEqual([some, other]);
    expect(result.current.activeTab).toBe(0);
    expect(result.current.activeVariable).toEqual(some);
  });

  it('should update the active tab when setActiveTab is called', () => {
    mockedUseMultiColumnMeasureVariables.mockReturnValue([some, other]);
    const { result } = renderHook(() => useMultiColumnMeasureTabs());

    act(() => {
      result.current.setActiveTab(1);
    });

    expect(result.current.activeTab).toBe(1);
    expect(result.current.activeVariable).toEqual(other);
  });

  it('should reset the active tab when variables shrink', () => {
    const { result, rerender } = renderHook(() => useMultiColumnMeasureTabs());

    mockedUseMultiColumnMeasureVariables.mockReturnValue([some, other]);
    rerender();

    act(() => {
      result.current.setActiveTab(1);
    });

    expect(result.current.activeVariable).toEqual(other);

    mockedUseMultiColumnMeasureVariables.mockReturnValue([some]);
    rerender();

    expect(result.current.activeTab).toBe(0);
    expect(result.current.activeVariable).toEqual(some);
  });

  it('should handle empty variable list', () => {
    mockedUseMultiColumnMeasureVariables.mockReturnValue([]);
    const { result } = renderHook(() => useMultiColumnMeasureTabs());

    expect(result.current.variables).toEqual([]);
    expect(result.current.activeTab).toBe(0);
    expect(result.current.activeVariable).toBeUndefined();
  });
});
