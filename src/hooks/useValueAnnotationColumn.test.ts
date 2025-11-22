import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataType } from '../../datamodel';
import { useColumns, useStandardizedVariables } from '../stores/FreshNewStore';
import { useColumnUniqueValues } from './useColumnUniqueValues';
import { useFormatOptions } from './useFormatOptions';
import { useTermOptions } from './useTermOptions';
import { useValueAnnotationColumn } from './useValueAnnotationColumn';

vi.mock('../stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

vi.mock('./useColumnUniqueValues', () => ({
  useColumnUniqueValues: vi.fn(),
}));

vi.mock('./useTermOptions', () => ({
  useTermOptions: vi.fn(),
}));

vi.mock('./useFormatOptions', () => ({
  useFormatOptions: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);
const mockedUseColumnUniqueValues = vi.mocked(useColumnUniqueValues);
const mockedUseTermOptions = vi.mocked(useTermOptions);
const mockedUseFormatOptions = vi.mocked(useFormatOptions);

describe('useValueAnnotationColumn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStandardizedVariables.mockReturnValue({});
  });

  it('should return null when the column is missing', () => {
    mockedUseColumns.mockReturnValue({});
    mockedUseColumnUniqueValues.mockReturnValue([]);

    const { result } = renderHook(() => useValueAnnotationColumn(null));

    expect(result.current).toBeNull();
  });

  it('should return composed column data when the column exists', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'sex',
        allValues: [],
        dataType: DataType.categorical,
        levels: {
          M: { description: 'Male', standardizedTerm: 'term:male' },
        },
        missingValues: ['Unknown'],
        units: '',
        standardizedVariable: 'nb:Sex',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Sex': {
        id: 'nb:Sex',
        name: 'Sex',
      },
    });
    mockedUseColumnUniqueValues.mockReturnValue(['M', 'F']);
    mockedUseTermOptions.mockReturnValue([{ id: 'term:male', label: 'Male' }]);
    mockedUseFormatOptions.mockReturnValue([]);

    const { result } = renderHook(() => useValueAnnotationColumn('1'));

    expect(result.current).toEqual({
      id: '1',
      name: 'sex',
      dataType: DataType.categorical,
      uniqueValues: ['M', 'F'],
      levels: {
        M: { description: 'Male', standardizedTerm: 'term:male' },
      },
      missingValues: ['Unknown'],
      units: '',
      formatId: null,
      termOptions: [{ id: 'term:male', label: 'Male' }],
      formatOptions: [],
      showStandardizedTerm: true,
      showMissingToggle: true,
      showFormat: false,
      showUnits: false,
    });
  });

  it('defaults multi-column measure columns to continuous data type', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'measurement',
        allValues: [],
        dataType: null,
        standardizedVariable: 'nb:Assessment',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Assessment': {
        id: 'nb:Assessment',
        name: 'Assessment',
        is_multi_column_measure: true,
      },
    });
    mockedUseColumnUniqueValues.mockReturnValue(['Value']);
    mockedUseTermOptions.mockReturnValue([{ id: 'term:foo', label: 'Foo' }]);
    mockedUseFormatOptions.mockReturnValue([]);

    const { result } = renderHook(() => useValueAnnotationColumn('1'));

    expect(result.current?.dataType).toBe(DataType.continuous);
    expect(result.current?.showStandardizedTerm).toBe(false);
  });

  it('hides missing toggle when there are no unique values', () => {
    mockedUseColumns.mockReturnValue({
      '2': {
        id: '2',
        name: 'age',
        allValues: [],
        dataType: DataType.continuous,
        standardizedVariable: 'nb:Age',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Age': {
        id: 'nb:Age',
        name: 'Age',
      },
    });
    mockedUseColumnUniqueValues.mockReturnValue([]);
    mockedUseTermOptions.mockReturnValue([]);
    mockedUseFormatOptions.mockReturnValue([]);

    const { result } = renderHook(() => useValueAnnotationColumn('2'));

    expect(result.current?.showMissingToggle).toBe(false);
  });
});
