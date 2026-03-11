import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button, FormControlLabel, Switch } from '@mui/material';
import { DataType } from '../utils/internal_types';

export interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAssignDataType: (dataType: DataType | null) => void;
  hasMappedSelected?: boolean;
  onClearMappings: () => void;
  hideAnnotated: boolean;
  onHideAnnotatedChange: (hide: boolean) => void;
}

export default function BulkActionBar({
  selectedCount,
  onClearSelection,
  onAssignDataType,
  hasMappedSelected = false,
  onClearMappings,
  hideAnnotated,
  onHideAnnotatedChange,
}: BulkActionBarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <Box
      className={`border rounded-lg px-4 py-2 flex-1 transition-all ${
        hasSelection ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
      data-cy="action-bar"
    >
      <div className="flex items-center gap-x-4 overflow-x-auto">
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
            color="primary"
            onClick={onClearSelection}
            disabled={!hasSelection}
            startIcon={<CloseIcon fontSize="small" />}
            className="whitespace-nowrap"
            data-cy="clear-selection-button"
          >
            Clear selection
          </Button>
        </div>

        <div className="hidden sm:block h-6 min-w-[1px] bg-gray-300" />

        <div className="flex items-center gap-3">
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
        </div>

        <div className="hidden sm:block h-6 min-w-[1px] bg-gray-300" />
        <div className="flex items-center shrink-0">
          <Button
            size="small"
            variant="text"
            color="primary"
            disabled={!hasSelection || !hasMappedSelected}
            onClick={onClearMappings}
            startIcon={<CloseIcon fontSize="small" />}
            className="whitespace-nowrap"
            data-cy="bulk-unassign-mappings"
          >
            Clear Mappings
          </Button>
        </div>

        <div className="hidden sm:block h-6 min-w-[1px] bg-gray-300 ml-auto" />
        <div className="flex items-center ml-auto sm:ml-0 shrink-0">
          <FormControlLabel
            control={
              <Switch
                checked={hideAnnotated}
                onChange={(e) => onHideAnnotatedChange(e.target.checked)}
                color="primary"
                size="small"
                data-cy="hide-annotated-toggle"
              />
            }
            label={
              <Typography variant="body2" className="text-gray-700 whitespace-nowrap">
                Hide annotated
              </Typography>
            }
          />
        </div>
      </div>
    </Box>
  );
}

BulkActionBar.defaultProps = {
  hasMappedSelected: false,
};
