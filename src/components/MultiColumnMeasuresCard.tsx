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
import { MultiColumnMeasuresTerm, MultiColumnMeasuresTermCard } from '../utils/types';

interface TermCardProps {
  card: MultiColumnMeasuresTermCard;
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
  mappedColumnHeaders,
  availableTerms,
  columnOptions,
  onTermSelect,
  onColumnSelect,
  onRemoveColumn,
  onRemoveCard,
}: TermCardProps) {
  return (
    <Card
      elevation={3}
      className="w-full shadow-lg"
      data-cy={`multi-column-measures-card-${card.id}`}
    >
      <CardHeader
        data-cy={`multi-column-measures-card-${card.id}-header`}
        title={
          card.term ? (
            <Typography variant="h6" className="font-bold">
              {card.term.label}
            </Typography>
          ) : (
            <Autocomplete
              data-cy={`multi-column-measures-card-${card.id}-title-dropdown`}
              options={availableTerms}
              getOptionLabel={(option: MultiColumnMeasuresTerm) => option.label}
              getOptionDisabled={(option) => option.disabled || false}
              onChange={(_, newValue) => onTermSelect(newValue)}
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
          <IconButton onClick={onRemoveCard} data-cy={`remove-card-${card.id}-button`}>
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
                data-cy={`multi-column-measures-card-${card.id}-columns-dropdown`}
                options={columnOptions}
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
