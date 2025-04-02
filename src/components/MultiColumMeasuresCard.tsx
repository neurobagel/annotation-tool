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
import { Term, TermCard, Columns } from '../utils/types';

interface TermCardProps {
  card: TermCard;
  columns: Columns;
  availableTerms: Term[];
  columnOptions: Array<{ id: string; label: string; disabled: boolean }>;
  onTermSelect: (term: Term | null) => void;
  onColumnSelect: (columnId: string | null) => void;
  onRemoveColumn: (columnId: string) => void;
  onRemoveCard: () => void;
}

function MultiColumnMeasuresCard({
  card,
  columns,
  availableTerms,
  columnOptions,
  onTermSelect,
  onColumnSelect,
  onRemoveColumn,
  onRemoveCard,
}: TermCardProps) {
  return (
    <Card elevation={3} className="w-full" data-cy={`term-card-${card.id}`}>
      <CardHeader
        title={
          card.term ? (
            <Typography variant="h6" className="font-bold">
              {card.term.label}
            </Typography>
          ) : (
            <Autocomplete
              options={availableTerms}
              getOptionLabel={(option: Term) => option.label}
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
          <IconButton onClick={onRemoveCard} data-cy={`remove-card-${card.id}`}>
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
                options={columnOptions}
                getOptionLabel={(option) => option.label}
                getOptionDisabled={(option) => option.disabled || false}
                onChange={(_, newValue) => onColumnSelect(newValue?.id || null)}
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
