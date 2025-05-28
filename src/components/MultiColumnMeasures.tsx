import AddIcon from '@mui/icons-material/Add';
import { Fab, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import assessmentTerms from '../assets/assessmentTerms.json';
import { usePagination } from '../hooks';
import useDataStore from '../stores/data';
import { Term, TermCard } from '../utils/types';
import {
  createSeededUuidGenerator,
  initializeTermCards,
  getAvailableTerms,
  getColumnOptions,
  getAllMappedColumns,
  getAssignedTermIdentifiers,
} from '../utils/util';
import MultiColumnMeasuresCard from './MultiColumnMeasuresCard';

interface MultiColumnMeasuresProps {
  generateID?: () => string;
  terms?: Term[];
}

const defaultProps = {
  generateID: createSeededUuidGenerator('seed'),
  terms: assessmentTerms,
};

function MultiColumnMeasures({
  generateID = createSeededUuidGenerator('seed'),
  terms = assessmentTerms,
}: MultiColumnMeasuresProps) {
  const theme = useTheme();
  const columns = useDataStore((state) => state.columns);
  const updateColumnIsPartOf = useDataStore((state) => state.updateColumnIsPartOf);

  const assessmentToolConfigIdentifier = useDataStore
    .getState()
    .getAssessmentToolConfig().identifier;

  const assessmentToolColumns = useDataStore.getState().getAssessmentToolColumns();

  const [termCards, setTermCards] = useState<TermCard[]>(
    initializeTermCards({
      columns,
      terms,
      assessmentToolColumns,
      generateID,
    })
  );

  const itemsPerPage = 3;
  const { currentPage, currentItems, totalPages, handlePaginationChange } = usePagination<TermCard>(
    termCards,
    itemsPerPage
  );

  const allMappedColumns = getAllMappedColumns(termCards);

  const handleAddNewCard = () => {
    const newCard: TermCard = {
      id: generateID(),
      term: null,
      mappedColumns: [],
    };
    const newTermCards = [...termCards, newCard];
    setTermCards(newTermCards);

    const newTotalPages = Math.ceil(newTermCards.length / itemsPerPage);
    if (newTotalPages > totalPages) {
      handlePaginationChange({} as React.ChangeEvent<unknown>, newTotalPages);
    }
  };

  const handleTermSelect = (cardId: string, term: Term | null) => {
    setTermCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, term } : card)));
  };

  const handleColumnSelect = (cardId: string, columnId: string | null) => {
    if (!columnId) return;

    setTermCards((prev) =>
      prev.map((card) =>
        card.id === cardId && !card.mappedColumns.includes(columnId)
          ? { ...card, mappedColumns: [...card.mappedColumns, columnId] }
          : card
      )
    );

    const card = termCards.find((c) => c.id === cardId);
    if (card?.term) {
      updateColumnIsPartOf(columnId, {
        identifier: card.term.identifier,
        label: card.term.label,
      });
    }
  };

  const removeColumnFromCard = (cardId: string, columnId: string) => {
    setTermCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              mappedColumns: card.mappedColumns.filter((id) => id !== columnId),
            }
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
      const newTotalPages = Math.ceil(newCards.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        handlePaginationChange({} as React.ChangeEvent<unknown>, newTotalPages);
      }
    }
  };

  const columnsAssigned = () => {
    if (allMappedColumns.length === 0) return 'No columns assigned';
    if (allMappedColumns.length === 1) return '1 column assigned';
    return `${allMappedColumns.length} columns assigned`;
  };

  return (
    <div className="flex justify-center p-4" data-cy="multi-column-measures">
      <div className="flex flex-row gap-6 max-w-[1200px] w-full">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col items-center">
            <div className="w-full flex flex-col gap-4 mb-4">
              {currentItems.map((card) => (
                <MultiColumnMeasuresCard
                  key={card.id}
                  card={card}
                  mappedColumnHeaders={Object.fromEntries(
                    card.mappedColumns.map((id) => [id, columns[id]?.header || `Column ${id}`])
                  )}
                  availableTerms={getAvailableTerms(
                    terms,
                    getAssignedTermIdentifiers(termCards, card.id)
                  )}
                  columnOptions={getColumnOptions(
                    columns,
                    assessmentToolConfigIdentifier,
                    allMappedColumns
                  )}
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
        </div>

        <div className="flex-shrink-0">
          <Card
            className="w-full shadow-lg"
            elevation={3}
            data-cy="multi-column-measures-columns-card"
          >
            <CardHeader className="bg-gray-50" title="Assessment: all columns" />
            <CardContent className="text-center">
              <div className="max-h-[500px] overflow-auto">
                {assessmentToolColumns.map(({ id, header }) => (
                  <div key={id} className="p-2 border-b">
                    <Typography
                      sx={{
                        color: allMappedColumns.includes(id)
                          ? theme.palette.primary.main
                          : 'inherit',
                      }}
                    >
                      {header}
                    </Typography>
                  </div>
                ))}
              </div>
              <Typography variant="body2" className="mt-8">
                {columnsAssigned()}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

MultiColumnMeasures.defaultProps = defaultProps;
export default MultiColumnMeasures;
