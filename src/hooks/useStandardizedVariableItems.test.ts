import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStandardizedTerms, useStandardizedVariables } from '../stores/data';
import { VariableType } from '../utils/internal_types';
import { useStandardizedVariableItems } from './useStandardizedVariableItems';

vi.mock('../stores/data', () => ({
  useStandardizedTerms: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);
const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('useStandardizedVariableItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should explicitly separate demographic and collection variables', () => {
    mockedUseStandardizedVariables.mockReturnValue({
      'var:1': {
        id: 'var:1',
        name: 'Age',
        description: '',
        variable_type: VariableType.continuous,
      },
      'var:2': {
        id: 'var:2',
        name: 'Assessment Tool',
        description: '',
        variable_type: VariableType.collection,
      },
      'var:3': {
        id: 'var:3',
        name: 'Sex',
        description: '',
        variable_type: VariableType.categorical,
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({
      'term:1': {
        id: 'term:1',
        label: 'Subscale A',
        standardizedVariableId: 'var:2',
      },
    });

    const { result } = renderHook(() => useStandardizedVariableItems());

    expect(result.current.demographicVariables).toEqual([
      { id: 'var:1', label: 'Age' },
      { id: 'var:3', label: 'Sex' },
    ]);
    expect(result.current.collectionVariables).toEqual([
      {
        id: 'var:2',
        label: 'Assessment Tool',
        terms: [{ id: 'term:1', label: 'Subscale A' }],
      },
    ]);
  });

  it('should not sort demographic variables alphabetically', () => {
    mockedUseStandardizedVariables.mockReturnValue({
      'var:Z': {
        id: 'var:Z',
        name: 'Zebra',
        description: '',
        variable_type: VariableType.categorical,
      },
      'var:A': {
        id: 'var:A',
        name: 'Apple',
        description: '',
        variable_type: VariableType.categorical,
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({});

    const { result } = renderHook(() => useStandardizedVariableItems());

    expect(result.current.demographicVariables).toEqual([
      { id: 'var:Z', label: 'Zebra' },
      { id: 'var:A', label: 'Apple' },
    ]);
  });

  it('should sort collection terms alphabetically', () => {
    mockedUseStandardizedVariables.mockReturnValue({
      'var:collection': {
        id: 'var:collection',
        name: 'Collection',
        description: '',
        variable_type: VariableType.collection,
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({
      'term:Z': {
        id: 'term:Z',
        label: 'Zebra Term',
        standardizedVariableId: 'var:collection',
      },
      'term:A': {
        id: 'term:A',
        label: 'Apple Term',
        standardizedVariableId: 'var:collection',
      },
    });

    const { result } = renderHook(() => useStandardizedVariableItems());

    expect(result.current.collectionVariables[0].terms).toEqual([
      { id: 'term:A', label: 'Apple Term' },
      { id: 'term:Z', label: 'Zebra Term' },
    ]);
  });

  it('should return collection variables with an empty terms array if they have no terms attached', () => {
    mockedUseStandardizedVariables.mockReturnValue({
      'var:empty_collection': {
        id: 'var:empty_collection',
        name: 'Empty Collection',
        description: '',
        variable_type: VariableType.collection,
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({});

    const { result } = renderHook(() => useStandardizedVariableItems());

    expect(result.current.collectionVariables).toEqual([
      { id: 'var:empty_collection', label: 'Empty Collection', terms: [] },
    ]);
  });

  it('should include the abbreviation property when mapping collection terms', () => {
    mockedUseStandardizedVariables.mockReturnValue({
      'var:collection': {
        id: 'var:collection',
        name: 'Assessment Tool',
        description: '',
        variable_type: VariableType.collection,
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({
      'term:1': {
        id: 'term:1',
        label: 'Subscale A',
        standardizedVariableId: 'var:collection',
      },
      'term:2': {
        id: 'term:2',
        label: 'Subscale B',
        abbreviation: 'SB',
        standardizedVariableId: 'var:collection',
      },
    });

    const { result } = renderHook(() => useStandardizedVariableItems());

    expect(result.current.collectionVariables[0].terms).toEqual([
      { id: 'term:1', label: 'Subscale A', abbreviation: undefined },
      { id: 'term:2', label: 'Subscale B', abbreviation: 'SB' },
    ]);
  });
});
