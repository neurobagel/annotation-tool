import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField, Typography } from '@mui/material';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  totalCount: number;
  filteredCount: number;
}

const defaultProps = { placeholder: 'Filter...' };

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  onClear,
  placeholder = 'Filter...',
  totalCount,
  filteredCount,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-1 w-full max-w-md" data-cy="search-filter-container">
      <TextField
        size="small"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        fullWidth
        data-cy="search-filter-input"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" className="text-gray-400" />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={onClear}
                  edge="end"
                  data-cy="search-filter-clear"
                  aria-label="clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
      <Typography variant="caption" className="text-gray-500 ml-1" data-cy="search-filter-counter">
        Showing {filteredCount} of {totalCount} columns
      </Typography>
    </div>
  );
}

SearchFilter.defaultProps = defaultProps;
