import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Card,
  Chip,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
  Tooltip,
  Collapse,
  Box,
} from '@mui/material';
import { matchSorter, rankings } from 'match-sorter';
import { useState } from 'react';
import { AvailableTerm, CardDisplay, ColumnOption } from '../types/multiColumnMeasureTypes';

interface TermCardProps {
  card: CardDisplay;
  cardIndex: number;
  availableTerms: AvailableTerm[];
  columnOptions: ColumnOption[];
  mappedColumnHeaders: Record<string, string>;
  onCreateCollection: (termId: string | null) => void;
  onColumnSelect: (termId: string, columnId: string | null) => void;
  onRemoveColumn: (columnId: string) => void;
  onRemoveCard: () => void;
}

function MultiColumnMeasuresCard({
  card,
  cardIndex,
  availableTerms,
  columnOptions,
  mappedColumnHeaders,
  onCreateCollection,
  onColumnSelect,
  onRemoveColumn,
  onRemoveCard,
}: TermCardProps) {
  const [inputQueryString, setInputQueryString] = useState('');
  const [expanded, setExpanded] = useState(card.mappedColumns.length === 0);

  const filterOptions = (items: AvailableTerm[], { inputValue }: { inputValue: string }) =>
    matchSorter(items, inputValue, {
      keys: [
        (option) =>
          option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label,
      ],
      threshold: rankings.CONTAINS,
    });

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 1.5,
      }}
      data-cy={`multi-column-measures-card-${cardIndex}`}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          py: 1,
          bgcolor: 'grey.50',
        }}
        data-cy={`multi-column-measures-card-${cardIndex}-header`}
      >
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          {card.term ? (
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {card.term.abbreviation
                ? `${card.term.abbreviation} - ${card.term.label}`
                : card.term.label}
            </Typography>
          ) : (
            <Autocomplete
              data-cy={`multi-column-measures-card-${cardIndex}-title-dropdown`}
              options={availableTerms}
              getOptionLabel={(option) =>
                option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label
              }
              getOptionDisabled={(option) => option.disabled || false}
              onChange={(_, newValue) => onCreateCollection(newValue?.id || null)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(optionProps, option) => {
                const { key, ...otherProps } = optionProps;
                return (
                  <Tooltip
                    title={option.description || ''}
                    placement="right"
                    enterDelay={400}
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          fontSize: '16px',
                        },
                      },
                    }}
                  >
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <li key={option.id} {...otherProps} style={{ padding: '4px 8px' }}>
                      <div className="w-full">
                        <Typography variant="body2">
                          {option.abbreviation
                            ? `${option.abbreviation} - ${option.label}`
                            : option.label}
                        </Typography>
                      </div>
                    </li>
                  </Tooltip>
                );
              }}
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  label="Select assessment term"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    bgcolor: 'background.paper',
                    '& .MuiInputBase-root': { py: 0 },
                  }}
                />
              )}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {card.term && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              data-cy={`collapse-card-${cardIndex}-button`}
            >
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={onRemoveCard}
            data-cy={`remove-card-${cardIndex}-button`}
          >
            <CancelIcon color="error" fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {card.term && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'grey.200' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Autocomplete
                disableCloseOnSelect
                size="small"
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
                getOptionDisabled={(option) => option.isPartOfCollection || false}
                onChange={(_, newValue) => {
                  if (newValue && card.term) {
                    onColumnSelect(card.term.id, newValue.id);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label="Select column(s) to map"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <Box
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mt: 0.5 }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Mapped Columns:
                </Typography>
                {card.mappedColumns.map((columnId) => (
                  <Chip
                    size="small"
                    data-cy={`mapped-column-${columnId}`}
                    key={columnId}
                    label={mappedColumnHeaders[columnId] || `Column ${columnId}`}
                    onDelete={() => onRemoveColumn(columnId)}
                    color="primary"
                    variant="outlined"
                    sx={{
                      height: '24px',
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        px: 1,
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Collapse>
      )}
    </Card>
  );
}

export default MultiColumnMeasuresCard;
