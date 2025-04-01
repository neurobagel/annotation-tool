import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Fab,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  IconButton,
  Typography,
  Pagination,
} from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import assessmentTerms from '../assets/assessmentTerms.json';
import { usePagination } from '../hooks';
import useDataStore from '../stores/data';

interface Term {
  identifier: string;
  label: string;
  disabled?: boolean;
}

interface TermCard {
  id: string;
  term: Term | null;
  mappedColumns: string[];
}

function MultiColumnMeasures() {
  const columns = useDataStore((state) => state.columns);
  const updateColumnIsPartOf = useDataStore((state) => state.updateColumnIsPartOf);
  const [termCards, setTermCards] = useState<TermCard[]>(() => [
    {
      id: uuidv4(),
      term: null,
      mappedColumns: [],
    },
  ]);

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
    return assessmentTerms.map((term) => ({
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
      id: uuidv4(),
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
      setTermCards([
        {
          id: uuidv4(),
          term: null,
          mappedColumns: [],
        },
      ]);
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
          <Card key={card.id} elevation={3} className="w-full" data-cy={`term-card-${card.id}`}>
            <CardHeader
              title={
                card.term ? (
                  <Typography variant="h6" className="font-bold">
                    {card.term.label}
                  </Typography>
                ) : (
                  <Autocomplete
                    options={getAvailableTerms(card.id)}
                    getOptionLabel={(option: Term) => option.label}
                    getOptionDisabled={(option) => option.disabled}
                    onChange={(_, newValue: Term | null) => handleTermSelect(card.id, newValue)}
                    renderInput={(params) => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        label="Select assessment term"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                )
              }
              action={
                <IconButton onClick={() => removeCard(card.id)} data-cy={`remove-card-${card.id}`}>
                  <CancelIcon color="error" />
                </IconButton>
              }
              className="bg-gray-50"
            />
            {card.term && (
              <>
                <Divider />
                <CardContent>
                  <div className="mt-4">
                    <Typography variant="subtitle1" className="mb-2 font-bold text-gray-700">
                      Mapped Columns
                    </Typography>
                    <Autocomplete
                      options={getColumnOptions()}
                      getOptionLabel={(option) => option.label}
                      getOptionDisabled={(option) => option.disabled}
                      onChange={(_, newValue) => handleColumnSelect(card.id, newValue?.id || null)}
                      renderInput={(params) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          label="Select column to map"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {card.mappedColumns.map((columnId) => (
                      <Chip
                        key={columnId}
                        label={columns[columnId]?.header || `Column ${columnId}`}
                        onDelete={() => removeColumnFromCard(card.id, columnId)}
                        color="primary"
                        variant="outlined"
                        sx={{
                          width: 'fit-content',
                          maxWidth: '100%',
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}

        {termCards.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePaginationChange}
              color="primary"
              shape="rounded"
            />
          </div>
        )}
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

export default MultiColumnMeasures;
