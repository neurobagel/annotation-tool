import { useColumns } from '../stores/data';
import { MultiColumnCardData } from '../types/multiColumnMeasureTypes';
import { useColumnOptionsForMultiColumnMeasureVariable } from './useColumnOptionsForMultiColumnMeasureVariable';
import { UsePersistedMultiColumnCardsOutput } from './usePersistedMultiColumnCards';
import { useTermsForMultiColumnMeasureVariable } from './useTermsForMultiColumnMeasureVariable';

interface UseMultiColumnMeasureCardDataOutput {
  cardData: MultiColumnCardData[];
  variableAllMappedColumns: string[];
  columnOptions: ReturnType<typeof useColumnOptionsForMultiColumnMeasureVariable>;
}

/**
 * Composes persisted + draft multi-column cards into ui ready data,
 * Adding term options, column options, and mapped column headers for each card.
 */
export function useMultiColumnMeasureCardData(
  variableId: string,
  combinedCards: UsePersistedMultiColumnCardsOutput[],
  persistedCards: UsePersistedMultiColumnCardsOutput[]
): UseMultiColumnMeasureCardDataOutput {
  const columns = useColumns();
  const availableTermsForVariable = useTermsForMultiColumnMeasureVariable(variableId);
  const columnOptionsForVariable = useColumnOptionsForMultiColumnMeasureVariable(variableId);

  const cardData: MultiColumnCardData[] = !variableId
    ? []
    : combinedCards.map((card) => {
        const cardDisplay = {
          id: card.id,
          term: card.term
            ? {
                id: card.term.id,
                label: card.term.label,
                abbreviation: card.term.abbreviation,
              }
            : null,
          mappedColumns: card.mappedColumns,
        };

        const availableTerms = availableTermsForVariable.map((term) =>
          term.id === card.term?.id ? { ...term, disabled: false } : term
        );

        const mappedColumnHeaders = Object.fromEntries(
          card.mappedColumns.map((id) => [id, columns[id]?.name || `Column ${id}`])
        );

        return {
          id: card.id,
          cardDisplay,
          availableTerms,
          columnOptions: columnOptionsForVariable,
          mappedColumnHeaders,
        };
      });

  const variableAllMappedColumns = persistedCards.flatMap((card) => card.mappedColumns);

  return {
    cardData,
    variableAllMappedColumns,
    columnOptions: columnOptionsForVariable,
  };
}
