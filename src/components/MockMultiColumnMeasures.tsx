import { useState } from 'react';
import {
    Typography,
    Card,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Fab,
    Button,
    Autocomplete,
    TextField,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { matchSorter, rankings } from 'match-sorter';
import MockMultiColumnMeasuresColumnsSidebar from './MockMultiColumnMeasuresColumnsSidebar';
import MockToolLibrary from './MockToolLibrary';
import DescriptionEditor from './DescriptionEditor';
import assessmentData from '../assets/default_config/assessment.json';

// -- Mock Data --
const INITIAL_COLUMNS = [
    { id: 'sub_ID', header: 'Subject ID' },
    { id: 'age', header: 'Age' },
    { id: 'sex', header: 'Sex' },
    // Unassigned columns suitable for grouping
    { id: 'wisc_vocab', header: 'WISC_Vocab_Score' },
    { id: 'wisc_matrix', header: 'WISC_Matrix_Reasoning' },
    { id: 'wisc_digit', header: 'WISC_Digit_Span' },
    { id: 'cbcl_int', header: 'CBCL_Internalizing' },
    { id: 'cbcl_ext', header: 'CBCL_Externalizing' },
    { id: 'cbcl_tot', header: 'CBCL_Total_Score' },
    { id: 'updrs_1', header: 'UPDRS_Part_I' },
    { id: 'updrs_2', header: 'UPDRS_Part_II' },
    { id: 'updrs_3', header: 'UPDRS_Part_III' },
];

const MOCK_TERMS = [
    { id: 'snomed:123', label: 'Wechsler Intelligence Scale for Children', abbreviation: 'WISC-V' },
    { id: 'snomed:456', label: 'Child Behavior Checklist', abbreviation: 'CBCL' },
    { id: 'snomed:789', label: 'Unified Parkinson\'s Disease Rating Scale', abbreviation: 'MDS-UPDRS' },
];

const ALL_TERMS = assessmentData.flatMap(vocab =>
    vocab.terms.map(term => ({
        id: term.id,
        label: term.name,
        // Mock abbrev logic
        abbreviation: term.name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 4)
    }))
);

type ColumnMetadata = {
    description: string;
    dataType: 'Continuous' | 'Categorical' | null;
};

export default function MockMultiColumnMeasures() {
    // State
    const [cards, setCards] = useState<{
        id: string,
        termId: string | null,
        termLabel?: string,
        mappedColumns: string[],
        viewMode: 'list' | 'table'
    }[]>([
        // Start empty
    ]);

    // Metadata state: Keyed by column ID for simplicity in mock
    const [columnMetadata, setColumnMetadata] = useState<Record<string, ColumnMetadata>>({});

    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [activeCardIdForSelection, setActiveCardIdForSelection] = useState<string | null>(null);

    // Derived
    const allMappedColumns = new Set(cards.flatMap(c => c.mappedColumns));

    // -- Handlers --

    const handleAssignColumnsToCard = (cardId: string, colIds: string[]) => {
        setCards(cards.map(c => {
            if (c.id === cardId) {
                const newCols = [...new Set([...c.mappedColumns, ...colIds])];
                return { ...c, mappedColumns: newCols };
            }
            return c;
        }));
    };

    const handleUnassignColumn = (cardId: string, columnId: string) => {
        setCards(cards.map(c => {
            if (c.id === cardId) {
                return { ...c, mappedColumns: c.mappedColumns.filter(id => id !== columnId) }
            }
            return c;
        }))
    }

    const handleOpenLibraryForCard = (cardId: string) => {
        setActiveCardIdForSelection(cardId);
        setIsLibraryOpen(true);
    };

    const handleLibrarySelect = (term: { id: string, label: string }) => {
        if (activeCardIdForSelection) {
            setCards(cards.map(c =>
                c.id === activeCardIdForSelection
                    ? { ...c, termId: term.id, termLabel: term.label }
                    : c
            ));
        }
        setIsLibraryOpen(false);
        setActiveCardIdForSelection(null);
    };


    const handleAddNewCard = () => {
        const newId = `card_${Date.now()}`;
        setCards([...cards, { id: newId, termId: null, mappedColumns: [], viewMode: 'list' }]);
    };

    const handleRemoveCard = (id: string) => {
        setCards(cards.filter(c => c.id !== id));
    };

    const toggleCardViewMode = (cardId: string) => {
        setCards(cards.map(c => c.id === cardId ? { ...c, viewMode: c.viewMode === 'list' ? 'table' : 'list' } : c));
    };

    const updateColumnMetadata = (colId: string, field: keyof ColumnMetadata, value: any) => {
        setColumnMetadata(prev => ({
            ...prev,
            [colId]: {
                ...prev[colId] || { description: '', dataType: 'Continuous' },
                [field]: value
            }
        }));
    };

    return (
        <div className="flex justify-center p-4 bg-gray-100 h-full overflow-hidden absolute inset-0 mt-[64px]">
            <div className="flex flex-col max-w-[1400px] w-full gap-4 h-full">


                <div className="flex flex-row gap-6 w-full h-full min-h-0 pb-8">

                    {/* LEFT: Cards */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4 h-full overflow-y-auto pr-2 pb-20">
                        <div className="w-full space-y-4">
                            {cards.map((card) => {
                                // Determine Display Label: Library Label -> Mock Label -> Fallback
                                const mockTerm = MOCK_TERMS.find(t => t.id === card.termId);
                                const label = card.termLabel || mockTerm?.label;
                                const abbr = mockTerm?.abbreviation; // Real library terms don't have abbrevs in this mock yet unless we look them up

                                const isConfigured = !!card.termId;

                                return (
                                    <Card
                                        key={card.id}
                                        elevation={3}
                                        className="w-full shadow-md overflow-visible transition-colors duration-200 border-l-4 border-l-transparent hover:border-l-blue-500"
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.style.backgroundColor = '#f0f9ff';
                                            e.currentTarget.style.borderColor = '#2196f3'; // Visual cue
                                            e.dataTransfer.dropEffect = 'copy';
                                        }}
                                        onDragLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.borderColor = '';
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.currentTarget.style.backgroundColor = '';
                                            e.currentTarget.style.borderColor = '';
                                            try {
                                                const data = JSON.parse(e.dataTransfer.getData('application/json'));
                                                if (data && Array.isArray(data.ids)) {
                                                    handleAssignColumnsToCard(card.id, data.ids);
                                                }
                                            } catch (err) {
                                                console.error('Failed to parse drag data', err);
                                            }
                                        }}
                                    >
                                        <CardHeader
                                            title={
                                                isConfigured ? (
                                                    <div className="flex items-center gap-2">
                                                        <Typography variant="h6" fontWeight="bold">{label}</Typography>
                                                        {abbr && <Chip label={abbr} size="small" color="primary" variant="outlined" />}
                                                        <Button
                                                            size="small"
                                                            sx={{ ml: 2, textTransform: 'none', color: 'text.secondary' }}
                                                            onClick={() => handleOpenLibraryForCard(card.id)}
                                                        >
                                                            (Change)
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Autocomplete
                                                            options={ALL_TERMS}
                                                            getOptionLabel={(option) => option.label}
                                                            filterOptions={(items, { inputValue }) =>
                                                                matchSorter(items, inputValue, {
                                                                    keys: [(item) => item.label],
                                                                    threshold: rankings.CONTAINS,
                                                                })
                                                            }
                                                            style={{ flex: 1 }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Select assessment term"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    fullWidth
                                                                />
                                                            )}
                                                            onChange={(_, newValue) => {
                                                                if (newValue) {
                                                                    setCards(cards.map(c => c.id === card.id ? { ...c, termId: newValue.id, termLabel: newValue.label } : c));
                                                                }
                                                            }}
                                                        />
                                                        <Tooltip title="Browse all measures">
                                                            <IconButton onClick={() => handleOpenLibraryForCard(card.id)} color="primary">
                                                                <LibraryBooksIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                )
                                            }
                                            action={
                                                <div className="flex gap-1">
                                                    <Tooltip title={card.viewMode === 'list' ? "Switch to Table View (Edit Details)" : "Switch to Chip View"}>
                                                        <IconButton onClick={() => toggleCardViewMode(card.id)} color={card.viewMode === 'table' ? 'primary' : 'default'}>
                                                            {card.viewMode === 'list' ? <TableRowsIcon /> : <ViewModuleIcon />}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <IconButton onClick={() => handleRemoveCard(card.id)}>
                                                        <CancelIcon color="error" />
                                                    </IconButton>
                                                </div>
                                            }
                                            className="bg-gray-50 border-b"
                                        />
                                        <CardContent>
                                            <div className="flex justify-between items-center mb-2">
                                                <Typography variant="subtitle2" className="text-gray-600 font-bold uppercase text-xs tracking-wider">
                                                    Mapped Columns ({card.mappedColumns.length})
                                                </Typography>
                                            </div>

                                            {card.viewMode === 'list' ? (
                                                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300 transition-all">
                                                    {card.mappedColumns.length === 0 && (
                                                        <div className="w-full text-center py-2 flex flex-col items-center justify-center text-gray-400">
                                                            <Typography variant="caption">
                                                                Drag Unassigned Columns Here
                                                            </Typography>
                                                        </div>
                                                    )}
                                                    {card.mappedColumns.map(colId => {
                                                        const col = INITIAL_COLUMNS.find(c => c.id === colId);
                                                        return (
                                                            <Chip
                                                                key={colId}
                                                                label={col?.header || colId}
                                                                size="medium"
                                                                onDelete={() => handleUnassignColumn(card.id, colId)}
                                                                color="secondary"
                                                                variant="filled"
                                                                className="shadow-sm"
                                                            />
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto border border-gray-200 rounded">
                                                    <Table size="small">
                                                        <TableHead className="bg-gray-100">
                                                            <TableRow>
                                                                <TableCell width="25%">Column</TableCell>
                                                                <TableCell width="45%">Description</TableCell>
                                                                <TableCell width="25%">Data Type</TableCell>
                                                                <TableCell width="5%" align="right">Actions</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {card.mappedColumns.map(colId => {
                                                                const col = INITIAL_COLUMNS.find(c => c.id === colId);
                                                                const meta = columnMetadata[colId] || { description: '', dataType: 'Continuous' };

                                                                return (
                                                                    <TableRow key={colId}>
                                                                        <TableCell className="font-medium text-gray-700 align-top pt-4">
                                                                            {col?.header || colId}
                                                                        </TableCell>
                                                                        <TableCell className="align-top">
                                                                            <div className="w-full mt-1">
                                                                                <DescriptionEditor
                                                                                    description={meta.description}
                                                                                    onDescriptionChange={(_, val) => updateColumnMetadata(colId, 'description', val)}
                                                                                    columnID={colId}
                                                                                />
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="align-top pt-3">
                                                                            <ToggleButtonGroup
                                                                                value={meta.dataType}
                                                                                exclusive
                                                                                onChange={(_, val) => {
                                                                                    if (val) updateColumnMetadata(colId, 'dataType', val)
                                                                                }}
                                                                                size="small"
                                                                                color="primary"
                                                                                className="shadow-sm w-full flex"
                                                                            >
                                                                                <Tooltip title="Categorical" arrow>
                                                                                    <ToggleButton value="Categorical" className="flex-1 w-1/2 px-2 py-1">
                                                                                        <span className="text-xs font-semibold">Cat.</span>
                                                                                    </ToggleButton>
                                                                                </Tooltip>
                                                                                <Tooltip title="Continuous" arrow>
                                                                                    <ToggleButton value="Continuous" className="flex-1 w-1/2 px-2 py-1">
                                                                                        <span className="text-xs font-semibold">Cont.</span>
                                                                                    </ToggleButton>
                                                                                </Tooltip>
                                                                            </ToggleButtonGroup>
                                                                        </TableCell>
                                                                        <TableCell align="right" className="align-top pt-3">
                                                                            <IconButton size="small" onClick={() => handleUnassignColumn(card.id, colId)}>
                                                                                <CancelIcon fontSize="small" color="action" />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            })}
                                                            {card.mappedColumns.length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} align="center" className="text-gray-400 italic py-4">
                                                                        No columns mapped. Drag items here to populate.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}

                            <div className="flex justify-center mt-4">
                                <Fab color="primary" onClick={handleAddNewCard} variant="extended" size="large">
                                    <AddIcon sx={{ mr: 1 }} />
                                    Add New Measure
                                </Fab>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Sidebar */}
                    <div className="w-80 flex-shrink-0 h-full">
                        <MockMultiColumnMeasuresColumnsSidebar
                            allColumns={INITIAL_COLUMNS}
                            mappedColumnIds={Array.from(allMappedColumns)}
                        />
                    </div>

                </div>
            </div>

            {/* Dialogs */}
            <MockToolLibrary
                open={isLibraryOpen}
                onClose={() => setIsLibraryOpen(false)}
                onSelect={handleLibrarySelect}
            />
        </div>
    );
}
