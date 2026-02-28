import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Select,
  MenuItem,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';

interface MockSearchFilterProps {
  // Legacy props for ColumnAnnotation compat
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  totalCount: number;
  filteredCount?: number;

  // New mock props
  value?: string;
  onChange?: (value: string) => void;
  showingCount?: number;
  hasActiveFilters?: boolean;
  onClearAll?: () => void;
  selectedCount?: number;
  onClearSelection?: () => void;
  showAnnotated?: boolean;
  onShowAnnotatedChange?: (checked: boolean) => void;
  sortOption?: string;
  onSortChange?: (value: string) => void;
}

export default function MockSearchFilter({
  searchTerm,
  onSearchChange,
  onClear,
  placeholder = 'Filter...',
  totalCount,
  filteredCount,

  value,
  onChange,
  showingCount,
  hasActiveFilters,
  onClearAll,
  selectedCount = 0,
  onClearSelection,
  showAnnotated = false,
  onShowAnnotatedChange,
  sortOption = 'default',
  onSortChange,
}: MockSearchFilterProps) {
  const currentSearchTerm = value ?? searchTerm ?? '';
  const currentOnSearchChange = onChange ?? onSearchChange ?? (() => { });
  const currentShowingCount = showingCount ?? filteredCount ?? 0;

  return (
    <div className="flex flex-col gap-4 w-full" data-cy="search-filter-container">
      {/* Top Row: Search Input, Show Annotated, Action Elements, and Sort Dropdown */}
      <div className="flex items-center justify-between w-full min-h-[40px] flex-wrap gap-4">
        {/* Left Section: Search Input and Show Annotated */}
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="w-full max-w-md">
            <TextField
              size="small"
              placeholder={placeholder}
              value={currentSearchTerm}
              onChange={(e) => currentOnSearchChange(e.target.value)}
              fullWidth
              data-cy="search-filter-input"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: currentSearchTerm ? (
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
          </div>

          {onShowAnnotatedChange && (
            <FormControlLabel
              control={
                <Switch
                  checked={showAnnotated}
                  onChange={(e) => onShowAnnotatedChange(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="body2" className="text-gray-700 whitespace-nowrap font-medium">
                  Show annotated
                </Typography>
              }
              className="m-0"
            />
          )}
        </div>

        {/* Right Section: Metadata and Sort */}
        <div className="flex items-center gap-6 shrink-0 flex-wrap justify-end">
          {/* Conditional Display: Either general column count OR selection info */}
          {selectedCount > 0 && onClearSelection ? (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm transition-all duration-200">
              <Typography variant="body2" className="font-semibold text-blue-800 whitespace-nowrap">
                {selectedCount} column{selectedCount !== 1 ? 's' : ''} selected
              </Typography>
              <IconButton
                size="small"
                onClick={onClearSelection}
                className="text-blue-600 hover:bg-blue-100 hover:text-blue-900 p-0.5 ml-1"
                aria-label="Clear selection"
                title="Clear selection"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Typography
                variant="body2"
                className="text-gray-500 whitespace-nowrap"
                data-cy="search-filter-counter"
              >
                Showing <span className="font-medium text-gray-700">{currentShowingCount}</span> of <span className="font-medium text-gray-700">{totalCount}</span>
              </Typography>

              {hasActiveFilters && onClearAll && (
                <Button
                  size="small"
                  variant="text"
                  color="inherit"
                  onClick={onClearAll}
                  className="whitespace-nowrap text-gray-500 hover:text-gray-800 tracking-wide min-w-0"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {onSortChange && (
            <div className="flex items-center gap-4">
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <Select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                variant="standard"
                disableUnderline
                displayEmpty
                size="small"
                data-cy="sort-dropdown"
                IconComponent={SortIcon}
                sx={{
                  '& .MuiSelect-select': {
                    py: 0.5,
                    pr: 4,
                    pl: 1,
                    fontWeight: 500,
                    color: 'text.secondary',
                  },
                  '& .MuiSvgIcon-root': { color: 'text.secondary' },
                }}
                renderValue={(val) =>
                  `Sort by: ${val === 'name_asc'
                    ? 'Name (A-Z)'
                    : val === 'name_desc'
                      ? 'Name (Z-A)'
                      : val === 'datatype'
                        ? 'Data Type'
                        : val === 'status'
                          ? 'Annotation Status'
                          : 'Original Order'
                  }`
                }
              >
                <MenuItem value="default">Original Order</MenuItem>
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                <MenuItem value="datatype">Data Type</MenuItem>
                <MenuItem value="status">Annotation Status</MenuItem>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
