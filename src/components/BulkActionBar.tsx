import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button } from '@mui/material';
import { DataType } from '../utils/internal_types';

export interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAssignDataType: (dataType: DataType | null) => void;
  hasMappedSelected?: boolean;
  onClearMappings: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onClearSelection,
  onAssignDataType,
  hasMappedSelected = false,
  onClearMappings,
}: BulkActionBarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <Box
      className={`border rounded-lg px-4 py-2 flex-1 transition-all ${
        hasSelection ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
      data-cy="action-bar"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-4">
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

        <div className="flex flex-wrap items-center gap-3">
          <Typography variant="body2" className="text-gray-600 font-medium whitespace-nowrap pr-1">
            Assign Data Type:
          </Typography>
          <div className="flex items-center gap-2">
            <Button
              variant="text"
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
              variant="text"
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
              variant="text"
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

          {hasMappedSelected && (
            <>
              <div className="hidden sm:block h-6 w-px bg-primary-200" />
              <Button
                size="small"
                variant="text"
                color="error"
                disabled={!hasSelection}
                onClick={onClearMappings}
                startIcon={<CloseIcon fontSize="small" />}
                className="whitespace-nowrap"
                data-cy="bulk-unassign-mappings"
              >
                Clear Mappings
              </Button>
            </>
          )}
        </div>
      </div>
    </Box>
  );
}

BulkActionBar.defaultProps = {
  hasMappedSelected: false,
};
