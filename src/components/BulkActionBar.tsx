import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button } from '@mui/material';
import { DataType } from '../utils/internal_types';

export interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAssignDataType: (dataType: DataType | null) => void;
}

export default function BulkActionBar({
  selectedCount,
  onClearSelection,
  onAssignDataType,
}: BulkActionBarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <Box
      className={`border rounded-lg px-4 py-2 shadow-sm flex-1 transition-all ${
        hasSelection ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'
      }`}
      data-cy="action-bar"
    >
      <div
        className={`w-full flex items-center justify-between gap-4 ${!hasSelection ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center gap-4">
          <Typography
            variant="subtitle1"
            className={`font-semibold whitespace-nowrap ${hasSelection ? 'text-primary-700' : 'text-gray-500'}`}
          >
            {`${selectedCount} column${selectedCount !== 1 ? 's' : ''} selected`}
          </Typography>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={onClearSelection}
            disabled={!hasSelection}
            startIcon={<CloseIcon fontSize="small" />}
            className="text-gray-500 hover:text-gray-700 whitespace-nowrap"
            data-cy="clear-selection-button"
          >
            Clear selection
          </Button>
        </div>

        <div
          className={`flex items-center gap-2 border-l pl-4 ml-auto ${hasSelection ? 'border-primary-200' : 'border-gray-300'}`}
        >
          <Typography variant="body2" className="text-gray-600 font-medium mr-2 whitespace-nowrap">
            Assign Data Type:
          </Typography>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            disabled={!hasSelection}
            onClick={() => onAssignDataType(DataType.categorical)}
            className={`whitespace-nowrap ${hasSelection ? 'bg-white' : ''}`}
            data-cy="bulk-assign-categorical"
          >
            Categorical
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            disabled={!hasSelection}
            onClick={() => onAssignDataType(DataType.continuous)}
            className={`whitespace-nowrap ${hasSelection ? 'bg-white' : ''}`}
            data-cy="bulk-assign-continuous"
          >
            Continuous
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            disabled={!hasSelection}
            onClick={() => onAssignDataType(null)}
            className={`whitespace-nowrap border-gray-300 ${hasSelection ? 'bg-white text-gray-700 hover:bg-gray-50' : 'text-gray-400'}`}
            data-cy="bulk-assign-none"
          >
            None
          </Button>
        </div>
      </div>
    </Box>
  );
}
