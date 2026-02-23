import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment, IconButton, Typography } from '@mui/material';

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
}

export default function SearchFilter({
  value,
  onChange,
  onClear,
  placeholder = 'Filter items...',
  showingCount,
  totalCount,
  className = '',
}: SearchFilterProps) {
  return (
    <div className={`w-full max-w-md ${className || ''}`}>
      <TextField
        fullWidth
        placeholder={placeholder}
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
      <Typography variant="caption" color="text.secondary" className="mt-1 block ml-1">
        Showing {showingCount} of {totalCount} items
      </Typography>
    </div>
  );
}
