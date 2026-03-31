import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, Typography, TextField, Card, IconButton, Box, Chip } from '@mui/material';
import { useGlobalMissingValues } from '../hooks/useGlobalMissingValues';

export default function GlobalMissingValues() {
  const {
    missingValues,
    availableSuggestions,
    inputValue,
    setInputValue,
    error,
    setError,
    handleAdd,
    handleRemove,
    handleUpdateDescription,
  } = useGlobalMissingValues();

  return (
    <Paper elevation={3} className="flex h-full flex-col p-6 shadow-lg">
      {/* TODO: Replace with a step in guided tour later */}
      <Typography
        variant="body1"
        color="text.secondary"
        data-cy="global-missing-values-description"
      >
        Define missing values and descriptions globally here. These descriptions will be
        automatically applied across all columns that contain these values.
      </Typography>

      <Box sx={{ mb: 4, mt: 2, maxWidth: 500 }}>
        <TextField
          fullWidth
          label="Add a missing value (e.g., -999, N/A)"
          variant="outlined"
          size="small"
          placeholder="Type and hit enter..."
          value={inputValue}
          error={!!error}
          helperText={error}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleAdd(inputValue);
            }
          }}
          slotProps={{
            htmlInput: {
              'data-cy': 'global-missing-value-input',
            },
            formHelperText: {
              'data-cy': 'global-missing-value-error-text',
            } as Record<string, string>,
          }}
        />
      </Box>

      {availableSuggestions.length > 0 && (
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Suggested from your data:
          </Typography>
          {availableSuggestions.map((suggestion) => (
            <Chip
              key={suggestion}
              label={`+ ${suggestion}`}
              onClick={() => handleAdd(suggestion)}
              color="primary"
              variant="outlined"
              size="small"
              data-cy={`global-missing-value-suggested-${suggestion}`}
              sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'primary.50' } }}
            />
          ))}
        </Box>
      )}

      {missingValues.length === 0 ? (
        <Typography
          variant="body2"
          color="text.disabled"
          sx={{ fontStyle: 'italic' }}
          data-cy="global-missing-values-empty-state"
        >
          No global missing values added yet. Add one above to get started.
        </Typography>
      ) : (
        <Box className="flex-1 space-y-3 overflow-y-auto pr-2 pb-4">
          {missingValues.map((mv) => (
            <Card
              key={mv.value}
              variant="outlined"
              data-cy={`global-missing-value-card-${mv.value}`}
              sx={{ display: 'flex', alignItems: 'center', p: 1.5 }}
            >
              <Box sx={{ flexShrink: 0, mr: 2, width: 140 }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {mv.value}
                </Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Enter a description (e.g., Missing data)..."
                value={mv.description}
                onChange={(e) => handleUpdateDescription(mv.value, e.target.value)}
                slotProps={{
                  htmlInput: {
                    'data-cy': `global-missing-value-description-${mv.value}`,
                  },
                }}
              />
              <IconButton
                color="error"
                onClick={() => handleRemove(mv.value)}
                sx={{ ml: 1 }}
                aria-label="delete"
                data-cy={`global-missing-value-delete-${mv.value}`}
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          ))}
        </Box>
      )}
    </Paper>
  );
}
