import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useColumns } from '../stores/data';
import type { Columns } from '../utils/internal_types';
import { useColumnOptionsForMultiColumnMeasureVariable } from './useColumnOptionsForMultiColumnMeasureVariable';
import { useMultiColumnMeasureCardData } from './useMultiColumnMeasureCardData';
import type { UsePersistedMultiColumnCardsOutput } from './usePersistedMultiColumnCards';
import { useTermsForMultiColumnMeasureVariable } from './useTermsForMultiColumnMeasureVariable';

vi.mock('../stores/data', () => ({
  useColumns: vi.fn(),
}));
vi.mock('./useColumnOptionsForMultiColumnMeasureVariable', () => ({
  useColumnOptionsForMultiColumnMeasureVariable: vi.fn(),
}));
vi.mock('./useTermsForMultiColumnMeasureVariable', () => ({
  useTermsForMultiColumnMeasureVariable: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseColumnOptionsForVariable = vi.mocked(useColumnOptionsForMultiColumnMeasureVariable);
const mockedUseTermsForVariable = vi.mocked(useTermsForMultiColumnMeasureVariable);

describe('useMultiColumnMeasureCardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return card data with available terms and column headers', () => {
    const columns: Columns = {
      'col-1': { id: 'col-1', name: 'Column 1', allValues: [], standardizedVariable: 'var-1' },
      'col-2': { id: 'col-2', name: 'Column 2', allValues: [], standardizedVariable: 'var-1' },
    };
    const combinedCards: UsePersistedMultiColumnCardsOutput[] = [
      {
        id: 'card-1',
        term: { id: 'term-1', label: 'Term 1', standardizedVariableId: 'var-1' },
        mappedColumns: ['col-1'],
      },
    ];
    const persistedCards = combinedCards;

    mockedUseColumns.mockReturnValue(columns);
    mockedUseTermsForVariable.mockReturnValue([{ id: 'term-1', label: 'Term 1', disabled: true }]);
    mockedUseColumnOptionsForVariable.mockReturnValue([
      { id: 'col-1', label: 'Column 1', isPartOfCollection: false },
    ]);

    const { result } = renderHook(() =>
      useMultiColumnMeasureCardData('var-1', combinedCards, persistedCards)
    );

    expect(result.current.cardData).toHaveLength(1);
    const card = result.current.cardData[0];
    expect(card.cardDisplay.term?.id).toBe('term-1');
    expect(card.availableTerms[0].disabled).toBe(false);
    expect(card.mappedColumnHeaders['col-1']).toBe('Column 1');
    expect(result.current.variableAllMappedColumns).toEqual(['col-1']);
    expect(result.current.columnOptions).toEqual([
      { id: 'col-1', label: 'Column 1', isPartOfCollection: false },
    ]);
  });

  it('should handle draft cards without terms', () => {
    const columns: Columns = {
      'col-1': { id: 'col-1', name: 'Column 1', allValues: [], standardizedVariable: 'var-1' },
    };
    const combinedCards: UsePersistedMultiColumnCardsOutput[] = [
      {
        id: 'draft-1',
        term: null,
        mappedColumns: ['col-1'],
      },
    ];

    mockedUseColumns.mockReturnValue(columns);
    mockedUseTermsForVariable.mockReturnValue([{ id: 'term-1', label: 'Term 1', disabled: false }]);
    mockedUseColumnOptionsForVariable.mockReturnValue([
      { id: 'col-1', label: 'Column 1', isPartOfCollection: false },
    ]);

    const { result } = renderHook(() => useMultiColumnMeasureCardData('var-1', combinedCards, []));

    expect(result.current.cardData[0].cardDisplay.term).toBeNull();
    expect(result.current.cardData[0].mappedColumnHeaders['col-1']).toBe('Column 1');
  });

  it('should return empty card data when variableId is empty', () => {
    mockedUseColumns.mockReturnValue({});
    mockedUseTermsForVariable.mockReturnValue([]);
    mockedUseColumnOptionsForVariable.mockReturnValue([]);

    const { result } = renderHook(() => useMultiColumnMeasureCardData('', [], []));

    expect(result.current.cardData).toEqual([]);
    expect(result.current.variableAllMappedColumns).toEqual([]);
  });
});
