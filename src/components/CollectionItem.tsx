import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Typography, TextField, IconButton, InputAdornment, Collapse } from '@mui/material';
import { useState, useMemo } from 'react';
import { StandardizedVariableListNode } from '~/utils/internal_types';
import VirtualListbox from './VirtualListBox';

interface CollectionItemProps {
  node: StandardizedVariableListNode;
  onNodeSelect: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

function CollectionItem({ node, onNodeSelect, selectedNodeId }: CollectionItemProps) {
  const [query, setQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredTerms = useMemo(() => {
    if (!node.terms || query.trim() === '') return node.terms || [];
    const q = query.toLowerCase();
    return node.terms.filter((t) => t.label.toLowerCase().includes(q));
  }, [node.terms, query]);

  return (
    <div className="flex flex-col space-y-2">
      <Typography variant="subtitle2" className="font-semibold px-2 text-gray-700">
        {node.label}
      </Typography>
      {!isSearchVisible ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsSearchVisible(true)}
          className="flex items-center px-2 text-gray-500 cursor-pointer hover:text-blue-600 transition-colors duration-200 py-1"
        >
          <SearchIcon fontSize="small" className="mr-2" />
          <Typography variant="body2" className="font-medium">
            Search terms...
          </Typography>
        </div>
      ) : (
        <Collapse in={isSearchVisible}>
          <div className="px-2">
            <TextField
              data-cy="search-terms-input"
              fullWidth
              size="small"
              placeholder="Search terms..."
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
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
                  ) : (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setIsSearchVisible(false);
                          setQuery('');
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
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
        </Collapse>
      )}
      {filteredTerms.length > 0 && (
        <div className="px-2 w-full">
          <div className="border rounded-md border-gray-200 overflow-hidden bg-white">
            <VirtualListbox className="m-0 p-0 list-none">
              {filteredTerms.map((term) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  key={term.id}
                  role="button"
                  tabIndex={0}
                  className={`flex items-center w-full px-3 h-full cursor-pointer transition-colors ${
                    selectedNodeId === term.id
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => onNodeSelect(term.id)}
                  title={term.label}
                >
                  <Typography variant="body2" noWrap>
                    {term.label}
                  </Typography>
                </div>
              ))}
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
  selectedNodeId: null,
};

export default CollectionItem;
