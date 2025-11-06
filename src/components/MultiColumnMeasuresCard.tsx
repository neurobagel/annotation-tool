import CancelIcon from '@mui/icons-material/Cancel';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
} from '@mui/material';
import { matchSorter, rankings } from 'match-sorter';
import { useState } from 'react';
import { MultiColumnMeasuresTerm, MultiColumnMeasuresTermCard } from '../utils/internal_types';

interface TermCardProps {
  card: MultiColumnMeasuresTermCard;
  cardIndex: number;
  mappedColumnHeaders: { [columnId: string]: string };
  availableTerms: MultiColumnMeasuresTerm[];
  columnOptions: Array<{ id: string; label: string; disabled: boolean }>;
  onTermSelect: (term: MultiColumnMeasuresTerm | null) => void;
  onColumnSelect: (columnId: string | null) => void;
  onRemoveColumn: (columnId: string) => void;
  onRemoveCard: () => void;
}

function MultiColumnMeasuresCard({
  card,
  cardIndex,
  mappedColumnHeaders,
  availableTerms,
  columnOptions,
  onTermSelect,
  onColumnSelect,
  onRemoveColumn,
  onRemoveCard,
}: TermCardProps) {
  const [inputQueryString, setInputQueryString] = useState('');

  const filterOptions = (
    items: MultiColumnMeasuresTerm[],
    { inputValue }: { inputValue: string }
  ) =>
    matchSorter(items, inputValue, {
      keys: [
        (option) =>
          option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label,
      ],
      threshold: rankings.CONTAINS,
    });

  return (
    <Card
      elevation={3}
      className="w-full shadow-lg"
      data-cy={`multi-column-measures-card-${cardIndex}`}
    >
      <CardHeader
        data-cy={`multi-column-measures-card-${cardIndex}-header`}
        title={
          card.term ? (
            <Typography variant="h6" className="font-bold">
              {card.term.abbreviation
                ? `${card.term.abbreviation} - ${card.term.label}`
                : card.term.label}
            </Typography>
          ) : (
            <Autocomplete
              data-cy={`multi-column-measures-card-${cardIndex}-title-dropdown`}
              options={availableTerms}
              getOptionLabel={(option: MultiColumnMeasuresTerm) =>
                option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label
              }
              getOptionDisabled={(option) => option.disabled || false}
              onChange={(_, newValue) => onTermSelect(newValue)}
              filterOptions={filterOptions}
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
          <IconButton onClick={onRemoveCard} data-cy={`remove-card-${cardIndex}-button`}>
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
              <Autocomplete
                disableCloseOnSelect
                data-cy={`multi-column-measures-card-${cardIndex}-columns-dropdown`}
                options={columnOptions}
                inputValue={inputQueryString}
                onInputChange={(_, newInputValue, reason) => {
                  // We want to make sure we only update the text in the dropdown
                  // when the user types, not when the user makes a selection
                  if (reason === 'input' || reason === 'clear') {
                    setInputQueryString(newInputValue);
                  }
                }}
                getOptionLabel={(option) => option.label}
                getOptionDisabled={(option) => option.disabled || false}
                onChange={(_, newValue) => onColumnSelect(newValue?.id || null)}
                renderInput={(params) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label="Select column(s) to map"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Typography variant="subtitle1" className="mb-2 font-bold text-gray-700">
                Mapped Columns:
              </Typography>
              {card.mappedColumns.map((columnId) => (
                <Chip
                  data-cy={`mapped-column-${columnId}`}
                  key={columnId}
                  label={mappedColumnHeaders[columnId] || `Column ${columnId}`}
                  onDelete={() => onRemoveColumn(columnId)}
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
  );
}

export default MultiColumnMeasuresCard;
