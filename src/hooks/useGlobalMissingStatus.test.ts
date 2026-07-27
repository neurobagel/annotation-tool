import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useColumns, useDataActions } from '../stores/data';
import type { Columns, Column } from '../utils/internal_types';
import { useGlobalMissingStatus } from './useGlobalMissingStatus';

vi.mock('../stores/data', () => ({
  useColumns: vi.fn(),
  useDataActions: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseDataActions = vi.mocked(useDataActions);

describe('useGlobalMissingStatus', () => {
  const mockUserAppliesGlobalMissingValues = vi.fn();
  const mockUserRemovesGlobalMissingValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDataActions.mockReturnValue({
      userAppliesGlobalMissingStatus: mockUserAppliesGlobalMissingValues,
      userRemovesGlobalMissingStatus: mockUserRemovesGlobalMissingValue,
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
      allValues: ['M', 'F', 'N/A', '-999', 'missing', 'UNKNOWN', '', ' ', '  ', 'n/a ', ' n/a'],
    } as unknown as Column,
  });

  it('should initialize with empty state and no error', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());

    const { result } = renderHook(() => useGlobalMissingStatus());

    expect(result.current.inputValue).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.missingValues).toEqual([]);
  });

  it('should generate available suggestions case-insensitively based on data, including whitespace', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());

    const { result } = renderHook(() => useGlobalMissingStatus());

    expect(result.current.availableSuggestions).toEqual([
      'N/A',
      '-999',
      'missing',
      'UNKNOWN',
      '',
      ' ',
      '  ',
      'n/a ',
      ' n/a',
    ]);
  });

  it('should filter out suggestions that are already locally staged missing values', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());

    const { result } = renderHook(() => useGlobalMissingStatus());

    act(() => {
      // Stage a suggestion manually
      result.current.handleAdd('N/A');
    });

    expect(result.current.availableSuggestions).toEqual([
      '-999',
      'missing',
      'UNKNOWN',
      '',
      ' ',
      '  ',
      'n/a ',
      ' n/a',
    ]);
  });

  it('should set an error and not add value if value is not in any column', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());

    const { result } = renderHook(() => useGlobalMissingStatus());

    act(() => {
      result.current.handleAdd('invalid_value');
    });

    expect(result.current.error).toBe('Value "invalid_value" not found in dataset.');
    expect(result.current.missingValues).toEqual([]);
  });

  it('should add value to local state and clear error/input if value exists in columns', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());

    const { result } = renderHook(() => useGlobalMissingStatus());

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
    expect(result.current.missingValues).toEqual([{ value: 'N/A' }]);
    expect(result.current.inputValue).toBe('');
  });

  it('should handle updating a description locally', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());

    const { result } = renderHook(() => useGlobalMissingStatus());

    act(() => {
      result.current.handleAdd('-999');
    });

    act(() => {
      result.current.handleUpdateDescription('-999', 'Missing code');
    });

    expect(result.current.missingValues).toEqual([{ value: '-999', description: 'Missing code' }]);
  });

  it('should handle removing a staged value locally', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());

    const { result } = renderHook(() => useGlobalMissingStatus());

    act(() => {
      result.current.handleAdd('N/A');
      result.current.handleRemove('N/A');
    });

    expect(result.current.missingValues).toEqual([]);
  });

  it('should call userAppliesGlobalMissingStatus when handleApplyToAll is triggered', () => {
    mockedUseColumns.mockReturnValue(createMockColumns());
    const { result } = renderHook(() => useGlobalMissingStatus());

    act(() => {
      result.current.handleAdd('N/A');
      result.current.handleUpdateDescription('N/A', 'Global N/A desc');
    });

    act(() => {
      result.current.handleApplyToAll('N/A');
    });

    expect(mockUserAppliesGlobalMissingValues).toHaveBeenCalledWith([
      { value: 'N/A', description: 'Global N/A desc' },
    ]);
  });

  it('should call userRemovesGlobalMissingStatus when handleRemoveFromColumns is triggered', () => {
    mockedUseColumns.mockReturnValue({});
    const { result } = renderHook(() => useGlobalMissingStatus());

    act(() => {
      result.current.handleRemoveFromColumns('N/A');
    });

    expect(mockUserRemovesGlobalMissingValue).toHaveBeenCalledWith('N/A');
  });
});
