import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStandardizedTerms } from '../stores/data';
import { DataType } from '../utils/internal_types';
import { useAnnotatedVariables } from './useAnnotatedVariables';
import { useValueAnnotationColumns } from './useValueAnnotationColumns';
import { useValueAnnotationNavData } from './useValueAnnotationNavData';

vi.mock('../stores/data', () => ({
  useStandardizedTerms: vi.fn(),
}));

vi.mock('./useAnnotatedVariables', () => ({
  useAnnotatedVariables: vi.fn(),
}));

vi.mock('./useValueAnnotationColumns', () => ({
  useValueAnnotationColumns: vi.fn(),
}));

const mockedUseAnnotatedVariables = vi.mocked(useAnnotatedVariables);
const mockedUseValueAnnotationColumns = vi.mocked(useValueAnnotationColumns);
const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('useValueAnnotationNavData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return annotated and unannotated groups with multi-column measure metadata', () => {
    mockedUseValueAnnotationColumns.mockReturnValue({
      columns: {},
      annotatedColumnGroups: [
        {
          standardizedVariableId: 'nb:Assessment',
          label: 'assessment tool',
          columns: [
            {
              id: '1',
              column: {
                id: '1',
                name: 'score',
                allValues: [],
                isPartOf: 'term:a',
              },
            },
            {
              id: '2',
              column: {
                id: '2',
                name: 'error',
                allValues: [],
                isPartOf: '',
              },
            },
          ],
        },
      ],
      unannotatedColumnGroups: [
        {
          key: DataType.categorical,
          columns: [
            {
              id: '3',
              column: {
                id: '3',
                name: 'sex',
                allValues: [],
              },
            },
          ],
        },
      ],
    });

    mockedUseAnnotatedVariables.mockReturnValue([
      {
        standardizedVariableId: 'nb:Assessment',
        standardizedVariable: {
          id: 'nb:Assessment',
          name: 'Assessment',
        },
        columnIds: ['1', '2'],
        isMultiColumnMeasure: true,
      },
    ]);

    mockedUseStandardizedTerms.mockReturnValue({
      'term:a': {
        id: 'term:a',
        standardizedVariableId: 'nb:Assessment',
        label: 'Subscale A',
      },
    });

    const { result } = renderHook(() => useValueAnnotationNavData());

    expect(result.current.annotatedGroups).toEqual([
      {
        standardizedVariableId: 'nb:Assessment',
        label: 'assessment tool',
        columns: [
          {
            id: '1',
            column: expect.objectContaining({ name: 'score' }),
          },
          {
            id: '2',
            column: expect.objectContaining({ name: 'error' }),
          },
        ],
        isMultiColumnMeasure: true,
        groupedColumns: [
          {
            label: 'Subscale A',
            columns: [
              {
                id: '1',
                column: expect.objectContaining({ name: 'score' }),
              },
            ],
          },
          {
            label: 'Ungrouped',
            columns: [
              {
                id: '2',
                column: expect.objectContaining({ name: 'error' }),
              },
            ],
          },
        ],
      },
    ]);

    expect(result.current.unannotatedGroups).toEqual([
      {
        key: DataType.categorical,
        columns: [
          {
            id: '3',
            column: expect.objectContaining({ name: 'sex' }),
          },
        ],
      },
    ]);
  });
});
