import CloseIcon from '@mui/icons-material/Close';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Box, Button, Typography, Autocomplete, TextField } from '@mui/material';

interface MockActionBarProps {
  selectedCount: number;
  options: any[]; // MOCK_OPTIONS
  onClearSelection: () => void;
  onAssignVariable: (variableId: string | null) => void;
  onIsCreatingGroupChange?: (isCreating: boolean) => void;
}

function MockActionBar({
  selectedCount,
  options,
  onClearSelection,
  onAssignVariable,
  onIsCreatingGroupChange,
}: MockActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <Box
      className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 shadow-sm w-full transition-all"
      data-cy="action-bar"
    >
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Typography variant="subtitle1" className="font-semibold text-primary-700">
            {selectedCount} column{selectedCount !== 1 ? 's' : ''} selected
          </Typography>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={onClearSelection}
            startIcon={<CloseIcon fontSize="small" />}
            className="text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            Clear selection
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Typography variant="body2" className="text-gray-600 font-medium">
              Map to Variable:
            </Typography>
            <Autocomplete
              options={options}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => onAssignVariable(value?.id || null)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select..."
                  size="small"
                  className="w-48 bg-gray-50"
                  variant="outlined"
                />
              )}
              size="small"
            />
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<LibraryAddIcon fontSize="small" />}
              onClick={() => {
                onIsCreatingGroupChange?.(true);
              }}
              className="shadow-sm"
              disableElevation
            >
              Create Group
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MockActionBar;
