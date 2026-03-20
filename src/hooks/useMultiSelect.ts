import { useState, useCallback, useRef, useEffect } from 'react';

export function useMultiSelect(visibleItemIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Use a ref for lastSelectedId because it's only used as an anchor for shift-click,
  // and we don't need it to trigger re-renders or changing/invalidate handleSelect.
  const lastSelectedIdRef = useRef<string | null>(null);

  // Use a ref for visibleItemIds to avoid changing/invalidating handleSelect
  // every time the visible list changes.
  const visibleItemIdsRef = useRef(visibleItemIds);
  useEffect(() => {
    visibleItemIdsRef.current = visibleItemIds;
  }, [visibleItemIds]);

  const handleSelect = useCallback(
    (id: string, isShiftPressed: boolean, isCtrlOrCmdPressed: boolean) => {
      setSelectedIds((prevSelected) => {
        const newSelected = new Set(prevSelected);
        const currentVisible = visibleItemIdsRef.current;
        const lastSelectedId = lastSelectedIdRef.current;

        // Shift+Click range selection
        if (isShiftPressed && lastSelectedId) {
          const lastIndex = currentVisible.indexOf(lastSelectedId);
          const currentIndex = currentVisible.indexOf(id);

          if (lastIndex !== -1 && currentIndex !== -1) {
            const start = Math.min(lastIndex, currentIndex);
            const end = Math.max(lastIndex, currentIndex);

            // Clear selection to replace it with the new range
            newSelected.clear();

            // Add all items in range to selection
            for (let i = start; i <= end; i += 1) {
              newSelected.add(currentVisible[i]);
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
          lastSelectedIdRef.current = id;
        } else {
          // Single Click selection (clears others)
          newSelected.clear();
          newSelected.add(id);
          lastSelectedIdRef.current = id;
        }

        return newSelected;
      });
    },
    []
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
    lastSelectedIdRef.current = null;
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  return {
    selectedIds,
    handleSelect,
    clearSelection,
    isSelected,
  };
}
