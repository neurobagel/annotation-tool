import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    List,
    ListItemText,
    ListItemButton,
    Typography,
    InputAdornment,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useMemo } from 'react';
import { matchSorter, rankings } from 'match-sorter';
import assessmentData from '../assets/default_config/assessment.json';

// Flatten the assessment data for search
const ALL_TERMS = assessmentData.flatMap(vocab =>
    vocab.terms.map(term => ({
        id: term.id,
        label: term.name,
        // Mock abbreviation if not present
        abbreviation: term.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 4),
        source: vocab.vocabulary_name
    }))
);

interface MockToolLibraryProps {
    open: boolean;
    onClose: () => void;
    onSelect: (term: { id: string; label: string }) => void;
}

export default function MockToolLibrary({ open, onClose, onSelect }: MockToolLibraryProps) {
    const [search, setSearch] = useState('');

    const filteredTerms = useMemo(() => {
        if (!search) return ALL_TERMS;
        return matchSorter(ALL_TERMS, search, {
            keys: ['label', 'abbreviation'],
            threshold: rankings.CONTAINS
        });
    }, [search]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { height: '80vh' }
            }}
        >
            <DialogTitle className="border-b">
                <Typography variant="h6" fontWeight="bold">
                    Assessment Tool Library
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Select a standardized measure to map your columns to.
                </Typography>
            </DialogTitle>
            <DialogContent className="p-0 flex flex-col h-full overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                    <TextField
                        fullWidth
                        placeholder="Search for tools (e.g. 'WISC', 'Depression')..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        size="medium"
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <List>
                        {filteredTerms.slice(0, 100).map((term) => (
                            <div key={term.id}>
                                <ListItemButton onClick={() => onSelect(term)}>
                                    <ListItemText
                                        primary={
                                            <span className="font-medium text-gray-800">
                                                {term.label}
                                            </span>
                                        }
                                        secondary={
                                            <span className="flex gap-2 text-xs mt-1">
                                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                                                    {term.abbreviation}
                                                </span>
                                                <span className="text-gray-500">
                                                    ID: {term.id}
                                                </span>
                                            </span>
                                        }
                                    />
                                </ListItemButton>
                                <Divider component="li" />
                            </div>
                        ))}
                        {filteredTerms.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No tools found matching &quot;{search}&quot;
                            </div>
                        )}
                    </List>
                </div>

                <div className="p-2 bg-gray-100 text-xs text-center text-gray-500 border-t">
                    Showing top {Math.min(filteredTerms.length, 100)} of {filteredTerms.length} results
                </div>
            </DialogContent>
        </Dialog>
    );
}
