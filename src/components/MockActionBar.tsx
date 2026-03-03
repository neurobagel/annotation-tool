import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Typography } from '@mui/material';

interface MockActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
}

function MockActionBar({ selectedCount, onClearSelection }: MockActionBarProps) {
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
      </div>
    </Box>
  );
}

export default MockActionBar;
