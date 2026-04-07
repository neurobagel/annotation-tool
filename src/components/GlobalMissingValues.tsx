import DeleteIcon from '@mui/icons-material/Delete';
import {
  Paper,
  Typography,
  TextField,
  Card,
  IconButton,
  Box,
  Chip,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useGlobalMissingStatus } from '../hooks/useGlobalMissingStatus';
import DescriptionEditor from './DescriptionEditor';

const formatMissingValueToken = (val: string) => {
  if (val === '') {
    return (
      <Typography
        component="span"
        sx={{ fontStyle: 'italic', color: 'text.disabled', fontFamily: 'inherit' }}
      >
        (empty string)
      </Typography>
    );
  }
  return (
    <Typography component="span" sx={{ whiteSpace: 'pre', fontFamily: 'inherit' }}>
      {`"${val}"`}
    </Typography>
  );
};

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
    handleApplyToAll,
    handleRemoveFromColumns,
  } = useGlobalMissingStatus();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={3} className="flex h-full flex-col p-6 shadow-lg">
      {/* TODO: Replace with a step in guided tour later */}
      <Typography
        variant="body1"
        color="text.secondary"
        data-cy="global-missing-values-description"
      >
        Stage missing values and their descriptions here. You must explicitly <b>Apply</b> them to
        propagate these updates across all relevant columns.
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
              label={<>+ {formatMissingValueToken(suggestion)}</>}
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
              <Box sx={{ flexShrink: 0, width: 110 }}>
                <Typography variant="body1">{formatMissingValueToken(mv.value)}</Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200, mr: 2, '& .MuiTextField-root': { my: 0 } }}>
                <DescriptionEditor
                  description={mv.description ?? null}
                  columnID="global-missing-value"
                  levelValue={mv.value}
                  onDescriptionChange={(_, newDesc) =>
                    handleUpdateDescription(mv.value, newDesc === null ? '' : newDesc)
                  }
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, ml: 'auto', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    handleApplyToAll(mv.value);
                    setSnackbar({
                      open: true,
                      message: 'Applied matching values to all columns!',
                      severity: 'success',
                    });
                  }}
                  data-cy={`global-missing-value-apply-${mv.value}`}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => {
                    handleRemoveFromColumns(mv.value);
                    setSnackbar({
                      open: true,
                      message: 'Stripped value from all columns!',
                      severity: 'success',
                    });
                  }}
                  data-cy={`global-missing-value-strip-${mv.value}`}
                >
                  Strip from Columns
                </Button>
                <IconButton
                  color="error"
                  onClick={() => handleRemove(mv.value)}
                  aria-label="Remove from staging"
                  title="Remove from staging"
                  data-cy={`global-missing-value-delete-${mv.value}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
