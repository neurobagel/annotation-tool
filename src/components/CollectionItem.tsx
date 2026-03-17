import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Typography, TextField, IconButton, InputAdornment, Box, Divider } from '@mui/material';
import { matchSorter, rankings } from 'match-sorter';
import { useState, useMemo } from 'react';
import { StandardizedVariableItem } from '~/utils/internal_types';
import VirtualListbox from './VirtualListBox';

const CHARS_PER_LINE = 28;
const BASE_ROW_HEIGHT = 32;
const LINE_HEIGHT = 22;

const getEstimatedHeight = (displayString: string) => {
  const lines = Math.ceil(displayString.length / CHARS_PER_LINE);
  return BASE_ROW_HEIGHT + lines * LINE_HEIGHT;
};

interface CollectionItemProps {
  variable: StandardizedVariableItem;
  onTermSelect: (termId: string) => void;
  hasMultipleSelection?: boolean;
  totalCollectionMappedCount: number;
  mappedTermCounts: Record<string, number>;
}

function CollectionItem({
  variable,
  onTermSelect,
  hasMultipleSelection = false,
  totalCollectionMappedCount,
  mappedTermCounts,
}: CollectionItemProps) {
  const [query, setQuery] = useState('');
  const isAlreadyMapped = totalCollectionMappedCount > 0;
  const isDisabled =
    (hasMultipleSelection || isAlreadyMapped) && variable.can_have_multiple_columns === false;

  const filteredTerms = useMemo(() => {
    if (!variable.terms) return [];
    if (query.trim() === '') return variable.terms;

    return matchSorter(variable.terms, query, {
      keys: [(term) => (term.abbreviation ? `${term.abbreviation} - ${term.label}` : term.label)],
      threshold: rankings.CONTAINS,
    });
  }, [variable.terms, query]);

  return (
    <div
      data-cy={`collection-item-${variable.id}`}
      className={`flex flex-col space-y-2 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      aria-disabled={isDisabled}
      title={isDisabled ? `${variable.label} can only be mapped to a single column` : undefined}
    >
      <div className="flex items-center justify-between px-2">
        <Typography variant="subtitle2" className="font-semibold text-gray-700 truncate">
          {variable.label}
        </Typography>
        {isAlreadyMapped && (
          <Box
            component="span"
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
            className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium"
            data-cy={`mapped-count-badge-${variable.id}`}
          >
            {totalCollectionMappedCount}
          </Box>
        )}
      </div>
      <div className="px-2">
        <TextField
          data-cy="search-terms-input"
          fullWidth
          size="small"
          placeholder="Search terms..."
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="disabled" />
                </InputAdornment>
              ),
              endAdornment: query ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: { borderRadius: 4, backgroundColor: 'grey.50' },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'grey.300' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
      </div>
      {filteredTerms.length > 0 && (
        <div className="px-2 w-full">
          <div className="border rounded-md border-gray-200 overflow-hidden bg-white">
            <VirtualListbox
              itemSize={(index) => {
                const term = filteredTerms[index];
                const displayString = term.abbreviation
                  ? `${term.abbreviation} - ${term.label}`
                  : term.label;
                return getEstimatedHeight(displayString);
              }}
            >
              {filteredTerms.map((term) => {
                const displayString = term.abbreviation
                  ? `${term.abbreviation} - ${term.label}`
                  : term.label;

                return (
                  <div key={term.id}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */}
                    <div
                      role="button"
                      className="flex items-center w-full px-3 py-2.5 cursor-pointer transition-colors hover:bg-gray-100 text-gray-800"
                      onClick={() => onTermSelect(term.id)}
                      title={displayString}
                      data-cy={`collection-term-item-${term.id}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Typography variant="body2" className="break-words whitespace-normal pr-2">
                          {displayString}
                        </Typography>
                        {mappedTermCounts[term.id] > 0 && (
                          <Box
                            component="span"
                            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
                            className="flex-shrink-0 ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium"
                            data-cy={`mapped-count-badge-term-${term.id}`}
                          >
                            {mappedTermCounts[term.id]}
                          </Box>
                        )}
                      </div>
                    </div>
                    {term !== filteredTerms[filteredTerms.length - 1] && <Divider />}
                  </div>
                );
              })}
            </VirtualListbox>
          </div>
        </div>
      )}
      {filteredTerms.length === 0 && query && (
        <div className="px-4 py-2 text-gray-500">
          <Typography variant="body2">No terms found matching &quot;{query}&quot;</Typography>
        </div>
      )}
    </div>
  );
}

CollectionItem.defaultProps = {
  hasMultipleSelection: false,
};

export default CollectionItem;
