import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import SearchIcon from '@mui/icons-material/Search';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { matchSorter, rankings } from 'match-sorter';
import { useState, useMemo } from 'react';

interface Column {
  id: string;
  header: string;
}

interface MockSidebarProps {
  allColumns: Column[];
  mappedColumnIds: string[];
}

export default function MockMultiColumnMeasuresColumnsSidebar({
  allColumns,
  mappedColumnIds,
}: MockSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumnIds, setSelectedColumnIds] = useState<string[]>([]);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [showAssigned, setShowAssigned] = useState(false);

  const filteredColumns = useMemo(() => {
    let cols = allColumns;

    // 1. Filter by Show/Hide Assigned
    if (!showAssigned) {
      cols = cols.filter((c) => !mappedColumnIds.includes(c.id));
    }

    // 2. Filter by Search Term
    if (!searchTerm) return cols;
    return matchSorter(cols, searchTerm, {
      keys: ['header', 'id'],
      threshold: rankings.CONTAINS,
    });
  }, [allColumns, searchTerm, showAssigned, mappedColumnIds]);

  const toggleSelection = (colId: string) => {
    if (selectedColumnIds.includes(colId)) {
      setSelectedColumnIds((prev) => prev.filter((id) => id !== colId));
    } else {
      setSelectedColumnIds((prev) => [...prev, colId]);
    }
  };

  const handleColumnClick = (e: React.MouseEvent, colId: string) => {
    // Prevent interaction if assigned
    if (mappedColumnIds.includes(colId)) return;

    // Standard File Explorer Behavior
    if (e.shiftKey && lastSelectedId) {
      // Range select
      const lastIndex = filteredColumns.findIndex((c) => c.id === lastSelectedId);
      const currentIndex = filteredColumns.findIndex((c) => c.id === colId);
      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const rangeIds = filteredColumns.slice(start, end + 1).map((c) => c.id);
        // Filter out assigned from range selection just in case
        const validRangeIds = rangeIds.filter((id) => !mappedColumnIds.includes(id));

        if (e.ctrlKey || e.metaKey) {
          setSelectedColumnIds((prev) => Array.from(new Set([...prev, ...validRangeIds])));
        } else {
          setSelectedColumnIds(validRangeIds);
        }
      }
    } else if (e.ctrlKey || e.metaKey) {
      // Toggle
      toggleSelection(colId);
      setLastSelectedId(colId);
    } else {
      // Single Select (clears others)
      setSelectedColumnIds([colId]);
      setLastSelectedId(colId);
    }
  };

  const handleDragStart = (e: React.DragEvent, colId: string) => {
    // Prevent drag if assigned
    if (mappedColumnIds.includes(colId)) {
      e.preventDefault();
      return;
    }

    let idsToDrag = [colId];
    // If dragging a selected item, drag the whole group
    if (selectedColumnIds.includes(colId)) {
      idsToDrag = selectedColumnIds;
    } else {
      // If dragging an unselected item, select it (visually) and drag just it
      setSelectedColumnIds([colId]);
      setLastSelectedId(colId);
    }

    e.dataTransfer.setData('application/json', JSON.stringify({ ids: idsToDrag }));
  };

  const handleSelectAll = () => {
    // Only select unassigned columns
    const allIds = filteredColumns.filter((c) => !mappedColumnIds.includes(c.id)).map((c) => c.id);
    setSelectedColumnIds(allIds);
  };

  const handleClearSelection = () => {
    setSelectedColumnIds([]);
    setLastSelectedId(null);
  };

  let content;
  if (allColumns.length === 0) {
    content = <div className="text-center p-4 text-gray-400 italic">No columns available.</div>;
  } else if (filteredColumns.length === 0) {
    content = (
      <div className="text-center p-4 text-gray-400 italic">
        {searchTerm ? `No columns match "${searchTerm}"` : 'All columns assigned!'}
      </div>
    );
  } else {
    content = filteredColumns.map((col) => {
      const isAssigned = mappedColumnIds.includes(col.id);
      const isSelected = selectedColumnIds.includes(col.id);

      let rowBgClass =
        'bg-white border-gray-200 hover:border-blue-300 hover:shadow cursor-grab active:cursor-grabbing';
      let spanClass = 'text-gray-700';

      if (isAssigned) {
        rowBgClass = 'bg-gray-100 border-gray-200 opacity-60 cursor-default';
        spanClass = 'text-gray-500 line-through';
      } else if (isSelected) {
        rowBgClass =
          'bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-300 cursor-grab active:cursor-grabbing';
        spanClass = 'text-blue-900';
      }

      return (
        <div
          key={col.id}
          draggable={!isAssigned}
          onClick={(e) => handleColumnClick(e, col.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Synthesize realistic click event
              const clickEvent = {
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
              } as React.MouseEvent;
              handleColumnClick(clickEvent, col.id);
            }
          }}
          onDragStart={(e) => handleDragStart(e, col.id)}
          role="button"
          tabIndex={0}
          className={`
                        group p-2 rounded border shadow-sm flex items-center justify-between transition-all
                        ${rowBgClass}
                    `}
        >
          <div className="flex items-center gap-2 overflow-hidden w-full">
            {!isAssigned && (
              <Checkbox
                size="small"
                checked={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(col.id);
                  setLastSelectedId(col.id);
                }}
                className="p-1"
              />
            )}
            {isAssigned && (
              <div className="p-2">
                <CheckCircleIcon fontSize="small" className="text-green-500" />
              </div>
            )}

            <div className="flex items-center gap-1 overflow-hidden">
              {!isAssigned && (
                <DragIndicatorIcon
                  className={`${isSelected ? 'text-blue-500' : 'text-gray-300 group-hover:text-gray-400'}`}
                  fontSize="small"
                />
              )}
              <span className={`font-medium truncate ${spanClass}`} title={col.header}>
                {col.header}
              </span>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <Card className="w-full shadow-lg h-full flex flex-col" elevation={3}>
      <CardHeader
        className="bg-gray-50 border-b flex-shrink-0"
        title={
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>
                <Typography variant="h6" className="text-gray-800">
                  Columns
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {allColumns.length - mappedColumnIds.length} unassigned
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={showAssigned}
                    onChange={(e) => setShowAssigned(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="caption" className="text-gray-600">
                    Show Assigned
                  </Typography>
                }
                labelPlacement="start"
                className="m-0"
              />
            </div>

            <div className="bg-white rounded-md mt-1">
              <TextField
                placeholder="Filter columns..."
                size="small"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  className: 'bg-white',
                }}
              />
            </div>

            {(searchTerm || selectedColumnIds.length > 0) && (
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-gray-500">{selectedColumnIds.length} selected</span>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    onClick={handleSelectAll}
                    sx={{ fontSize: '0.7rem', minWidth: 'auto', p: 0.5 }}
                  >
                    Select All
                  </Button>
                  <Button
                    size="small"
                    onClick={handleClearSelection}
                    color="warning"
                    sx={{ fontSize: '0.7rem', minWidth: 'auto', p: 0.5 }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        }
      />
      <CardContent className="flex-1 overflow-y-auto p-2 bg-gray-50/50">
        <div className="flex flex-col gap-2 select-none">{content}</div>
      </CardContent>
    </Card>
  );
}
