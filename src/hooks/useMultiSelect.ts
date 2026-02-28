import { useState, useCallback } from 'react';

export function useMultiSelect(visibleItemIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback(
    (id: string, isShiftPressed: boolean, isCtrlOrCmdPressed: boolean) => {
      setSelectedIds((prevSelected) => {
        const newSelected = new Set(prevSelected);

        // Shift+Click range selection
        if (isShiftPressed && lastSelectedId) {
          const lastIndex = visibleItemIds.indexOf(lastSelectedId);
          const currentIndex = visibleItemIds.indexOf(id);

          if (lastIndex !== -1 && currentIndex !== -1) {
            const start = Math.min(lastIndex, currentIndex);
            const end = Math.max(lastIndex, currentIndex);

            // Clear selection to replace it with the new range, preserving the other selections might be desired but standard shift+click replaces selection with the range from anchor
            newSelected.clear();

            // Add all items in range to selection
            for (let i = start; i <= end; i += 1) {
              newSelected.add(visibleItemIds[i]);
            }
          } else {
            // Fallback if item isn't in visible list for some reason
            newSelected.add(id);
          }
        } else if (isCtrlOrCmdPressed) {
          // Ctrl/Cmd+Click toggle selection
          if (newSelected.has(id)) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          setLastSelectedId(id);
        } else {
          // Single Click selection (clears others)
          newSelected.clear();
          newSelected.add(id);
          setLastSelectedId(id);
        }

        return newSelected;
      });
    },
    [visibleItemIds, lastSelectedId]
  );

  const clearSelection = useCallback(() => {
    setSelectedIds((prevSelected) => {
      // Prevent unnecessary re-renders
      // Returning the exact same reference (prevSelected) instead of a new Set()
      // prevents React from triggering an entire component re-render when the selection
      // is already empty, since React uses referential equality to check for state changes.
      if (prevSelected.size === 0) return prevSelected;
      return new Set();
    });
    setLastSelectedId((prev) => (prev === null ? prev : null));
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  return {
    selectedIds,
    handleSelect,
    clearSelection,
    isSelected,
  };
}
