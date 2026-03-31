import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useColumns,
  useGlobalMissingValues as useStoredGlobalMissingValues,
  useDataActions,
} from '../stores/data';
import type { Columns, Column } from '../utils/internal_types';
import { useGlobalMissingValues } from './useGlobalMissingValues';

vi.mock('../stores/data', () => ({
  useColumns: vi.fn(),
  useGlobalMissingValues: vi.fn(),
  useDataActions: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseGlobalMissingValues = vi.mocked(useStoredGlobalMissingValues);
const mockedUseDataActions = vi.mocked(useDataActions);

describe('useGlobalMissingValues', () => {
  const mockUserUpdatesGlobalMissingValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDataActions.mockReturnValue({
      userUpdatesGlobalMissingValue: mockUserUpdatesGlobalMissingValue,
    } as unknown as ReturnType<typeof useDataActions>);
  });

  const createMockColumns = (): Columns => ({
    '1': {
      id: '1',
      name: 'age',
      allValues: ['25', '30', 'N/A'],
    } as unknown as Column,
    '2': {
      id: '2',
      name: 'sex',
      allValues: ['M', 'F', 'N/A', '-999'],
    } as unknown as Column,
  });

  it('should initialize with empty input and no error', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());
    mockedUseGlobalMissingValues.mockReturnValue([]);

    const { result } = renderHook(() => useGlobalMissingValues());

    expect(result.current.inputValue).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.missingValues).toEqual([]);
  });

  it('should generate available suggestions based on data', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());
    mockedUseGlobalMissingValues.mockReturnValue([]);

    const { result } = renderHook(() => useGlobalMissingValues());

    expect(result.current.availableSuggestions).toEqual(['N/A', '-999']);
  });

  it('should filter out suggestions that are already active global missing values', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());
    mockedUseGlobalMissingValues.mockReturnValue([{ value: 'N/A', description: '' }]);

    const { result } = renderHook(() => useGlobalMissingValues());

    expect(result.current.availableSuggestions).toEqual(['-999']);
  });
  it('should set an error and not add value if value is not in any column', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());
    mockedUseGlobalMissingValues.mockReturnValue([]);

    const { result } = renderHook(() => useGlobalMissingValues());

    act(() => {
      result.current.handleAdd('invalid_value');
    });

    expect(result.current.error).toBe('Value "invalid_value" not found in dataset.');
    expect(mockUserUpdatesGlobalMissingValue).not.toHaveBeenCalled();
  });

  it('should add value and clear error/input if value exists in columns', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());
    mockedUseGlobalMissingValues.mockReturnValue([]);

    const { result } = renderHook(() => useGlobalMissingValues());

    act(() => {
      result.current.setInputValue('N/A');
    });

    act(() => {
      // Set error to verify it clears
      result.current.setError('Some old error');
      // Then trigger handler
      result.current.handleAdd('N/A');
    });

    expect(result.current.error).toBeNull();
    expect(mockUserUpdatesGlobalMissingValue).toHaveBeenCalledWith('N/A', true, '');
    expect(result.current.inputValue).toBe('');
  });

  it('should handle updating a description', () => {
    mockedUseColumns.mockReturnValue({});
    mockedUseGlobalMissingValues.mockReturnValue([]);

    const { result } = renderHook(() => useGlobalMissingValues());

    act(() => {
      result.current.handleUpdateDescription('-999', 'Missing code');
    });

    expect(mockUserUpdatesGlobalMissingValue).toHaveBeenCalledWith('-999', true, 'Missing code');
  });

  it('should handle removing a missing value', () => {
    mockedUseColumns.mockReturnValue({});
    mockedUseGlobalMissingValues.mockReturnValue([]);

    const { result } = renderHook(() => useGlobalMissingValues());

    act(() => {
      result.current.handleRemove('N/A');
    });

    expect(mockUserUpdatesGlobalMissingValue).toHaveBeenCalledWith('N/A', false);
  });
});
