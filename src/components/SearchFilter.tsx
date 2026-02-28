import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment, IconButton, Typography, Button } from '@mui/material';

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  // eslint-disable-next-line react/require-default-props
  placeholder?: string;
  showingCount: number;
  totalCount: number;
  // eslint-disable-next-line react/require-default-props
  className?: string;
  hasActiveFilters?: boolean;
  onClearAll?: () => void;
}

export default function SearchFilter({
  value,
  onChange,
  onClear,
  placeholder = 'Filter items...',
  showingCount,
  totalCount,
  className = '',
  hasActiveFilters = false,
  onClearAll,
}: SearchFilterProps) {
  return (
    <div className={`w-full max-w-md ${className || ''}`}>
      <TextField
        fullWidth
        placeholder={'Filter columns...'}
        variant="outlined"
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div className="flex items-center gap-2 mt-1 ml-1 h-6">
        <Typography
          variant="button"
          className="text-gray-500 normal-case"
          sx={{ fontSize: '0.8125rem' }}
        >
          Showing {showingCount} of {totalCount} items
        </Typography>
        {hasActiveFilters && onClearAll && (
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={onClearAll}
            startIcon={<CloseIcon fontSize="small" />}
            className="text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
