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
  Stack,
  IconButton,
  Typography,
  Pagination,
  ListItem,
} from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import assessmentTerms from '../assets/assessmentTerms.json';
import { usePagination } from '../hooks';
import useDataStore from '../stores/data';

interface Term {
  identifier: string;
  label: string;
}

interface TermCard {
  id: string;
  term: Term | null;
  mappedColumns: string[];
}

export function MultiColumnMeasures() {
  const columns = useDataStore((state) => state.columns);
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

  const getColumnOptions = () =>
    Object.entries(columns).map(([id, column]) => ({
      id,
      label: column.header,
      disabled: allMappedColumns.includes(id),
    }));

  const handleAddNewCard = () => {
    const newCard: TermCard = {
      id: uuidv4(),
      term: null,
      mappedColumns: [],
    };
    setTermCards([...termCards, newCard]);
    handlePaginationChange({} as React.ChangeEvent<unknown>, 1);
  };

  const handleTermSelect = (cardId: string, term: Term | null) => {
    setTermCards(termCards.map((card) => (card.id === cardId ? { ...card, term } : card)));
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
  };

  const removeColumnFromCard = (cardId: string, columnId: string) => {
    setTermCards(
      termCards.map((card) =>
        card.id === cardId
          ? { ...card, mappedColumns: card.mappedColumns.filter((id) => id !== columnId) }
          : card
      )
    );
  };

  const removeCard = (cardId: string) => {
    const newCards = termCards.filter((card) => card.id !== cardId);
    if (newCards.length === 0) {
      setTermCards([
        {
          id: uuidv4(),
          term: null,
          mappedColumns: [],
        },
      ]);
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
                    options={assessmentTerms}
                    getOptionLabel={(option: Term) => option.label}
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
                      renderOption={(props, option) => (
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        <ListItem {...props} style={{ opacity: option.disabled ? 0.5 : 1 }}>
                          {option.label}
                          {option.disabled && (
                            <span className="ml-2 text-gray-500 text-xs">(already mapped)</span>
                          )}
                        </ListItem>
                      )}
                    />
                  </div>
                  <Stack spacing={1} className="mt-4">
                    {card.mappedColumns.map((columnId) => (
                      <Chip
                        key={columnId}
                        label={columns[columnId]?.header || `Column ${columnId}`}
                        onDelete={() => removeColumnFromCard(card.id, columnId)}
                        color="primary"
                        variant="outlined"
                        sx={{
                          maxWidth: '100%',
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      />
                    ))}
                  </Stack>
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
