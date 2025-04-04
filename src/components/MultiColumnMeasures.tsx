import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import assessmentTerms from '../assets/assessmentTerms.json';
import { usePagination } from '../hooks';
import useDataStore from '../stores/data';
import { Term, TermCard } from '../utils/types';
import MultiColumMeasuresCard from './MultiColumnMeasuresCard';

interface MultiColumnMeasuresProps {
  generateID?: () => string;
  terms?: Term[];
}

const defaultProps = {
  generateID: uuidv4,
  terms: assessmentTerms,
};

function MultiColumnMeasures({
  generateID = uuidv4,
  terms = assessmentTerms,
}: MultiColumnMeasuresProps) {
  const columns = useDataStore((state) => state.columns);
  const updateColumnIsPartOf = useDataStore((state) => state.updateColumnIsPartOf);

  // Initialize term cards based on existing isPartOf relationships
  const initializeTermCards = (): TermCard[] => {
    const assessmentColumns = Object.entries(columns)
      .filter(([_, column]) => column.isPartOf)
      .reduce((acc, [columnId, column]) => {
        if (!column.isPartOf) return acc;

        const term = terms.find((t) => t.identifier === column.isPartOf?.termURL);
        if (!term) return acc;

        // Find or create card for this term
        let card = acc.find((c) => c.term?.identifier === term.identifier);
        if (!card) {
          card = {
            id: generateID(),
            term,
            mappedColumns: [],
          };
          acc.push(card);
        }

        // Add column to mappedColumns if not already present
        if (!card.mappedColumns.includes(columnId)) {
          card.mappedColumns.push(columnId);
        }

        return acc;
      }, [] as TermCard[]);

    return assessmentColumns.length > 0
      ? assessmentColumns
      : [{ id: generateID(), term: null, mappedColumns: [] }];
  };

  const [termCards, setTermCards] = useState<TermCard[]>(initializeTermCards);

  const itemsPerPage = 3;
  const { currentPage, currentItems, totalPages, handlePaginationChange } = usePagination<TermCard>(
    termCards,
    itemsPerPage
  );

  const allMappedColumns = termCards.flatMap((card) => card.mappedColumns);

  const getUsedTerms = (currentCardId?: string) =>
    termCards
      .filter((card) => card.term !== null && card.id !== currentCardId)
      .map((card) => card.term?.identifier);

  const getAvailableTerms = (currentCardId?: string) => {
    const usedTerms = getUsedTerms(currentCardId);
    return terms.map((term) => ({
      ...term,
      disabled: usedTerms.includes(term.identifier),
    }));
  };

  const getColumnOptions = () => {
    const assessmentToolConfig = useDataStore.getState().standardizedVariables['Assessment Tool'];
    return Object.entries(columns)
      .filter(
        ([_, column]) => column.standardizedVariable?.identifier === assessmentToolConfig.identifier
      )
      .map(([id, column]) => ({
        id,
        label: column.header,
        disabled: allMappedColumns.includes(id),
      }));
  };

  const handleAddNewCard = () => {
    const newCard: TermCard = {
      id: generateID(),
      term: null,
      mappedColumns: [],
    };
    const newTermCards = [...termCards, newCard];
    setTermCards(newTermCards);

    // Calculate if a new page was created
    const newTotalPages = Math.ceil(newTermCards.length / itemsPerPage);
    if (newTotalPages > totalPages) {
      // Move to the new page if one was created
      handlePaginationChange({} as React.ChangeEvent<unknown>, newTotalPages);
    }
  };

  const handleTermSelect = (cardId: string, term: Term | null) => {
    setTermCards(termCards.map((card) => (card.id === cardId ? { ...card, term } : card)));

    const foundCard = termCards.find((c) => c.id === cardId);
    if (foundCard) {
      foundCard.mappedColumns.forEach((columnId) => {
        updateColumnIsPartOf(columnId, term);
      });
    }
  };

  const handleColumnSelect = (cardId: string, columnId: string | null) => {
    if (!columnId) return;
    setTermCards(
      termCards.map((card) => {
        if (card.id === cardId && !card.mappedColumns.includes(columnId)) {
          return { ...card, mappedColumns: [...card.mappedColumns, columnId] };
        }
        return card;
      })
    );

    const card = termCards.find((c) => c.id === cardId);
    if (card?.term) {
      updateColumnIsPartOf(columnId, card.term);
    }
  };

  const removeColumnFromCard = (cardId: string, columnId: string) => {
    setTermCards(
      termCards.map((card) =>
        card.id === cardId
          ? { ...card, mappedColumns: card.mappedColumns.filter((id) => id !== columnId) }
          : card
      )
    );
    updateColumnIsPartOf(columnId, null);
  };

  const removeCard = (cardId: string) => {
    const card = termCards.find((c) => c.id === cardId);
    if (card) {
      card.mappedColumns.forEach((columnId) => {
        updateColumnIsPartOf(columnId, null);
      });
    }

    const newCards = termCards.filter((termCard) => termCard.id !== cardId);
    if (newCards.length === 0) {
      setTermCards([{ id: generateID(), term: null, mappedColumns: [] }]);
      handlePaginationChange({} as React.ChangeEvent<unknown>, 1);
    } else {
      setTermCards(newCards);
      if (currentPage > Math.ceil(newCards.length / itemsPerPage)) {
        handlePaginationChange(
          {} as React.ChangeEvent<unknown>,
          Math.ceil(newCards.length / itemsPerPage)
        );
      }
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-4 mb-4">
        {currentItems.map((card) => (
          <MultiColumMeasuresCard
            key={card.id}
            card={card}
            columns={columns}
            availableTerms={getAvailableTerms(card.id)}
            columnOptions={getColumnOptions()}
            onTermSelect={(term) => handleTermSelect(card.id, term)}
            onColumnSelect={(columnId) => handleColumnSelect(card.id, columnId)}
            onRemoveColumn={(columnId) => removeColumnFromCard(card.id, columnId)}
            onRemoveCard={() => removeCard(card.id)}
          />
        ))}
      </div>
      <Fab
        color="primary"
        onClick={handleAddNewCard}
        className="mt-4"
        data-cy="add-term-card-button"
      >
        <AddIcon />
      </Fab>
    </div>
  );
}

MultiColumnMeasures.defaultProps = defaultProps;
export default MultiColumnMeasures;
