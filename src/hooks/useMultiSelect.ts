import { useState } from 'react';

export function useMultiSelect(visibleItemIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string, isShiftPressed: boolean, isCtrlOrCmdPressed: boolean) => {
    if (isShiftPressed && lastSelectedId) {
      const lastIndex = visibleItemIds.indexOf(lastSelectedId);
      const currentIndex = visibleItemIds.indexOf(id);

      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);

        const newSelected = new Set<string>();
        for (let i = start; i <= end; i += 1) {
          newSelected.add(visibleItemIds[i]);
        }
        setSelectedIds(newSelected);
      } else {
        setSelectedIds((prev) => new Set(prev).add(id));
      }
    } else if (isCtrlOrCmdPressed) {
      setSelectedIds((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        return newSelected;
      });
      setLastSelectedId(id);
    } else {
      setSelectedIds(new Set([id]));
      setLastSelectedId(id);
    }
  };

  const clearSelection = () => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.size === 0) return prevSelected;
      return new Set();
    });
    setLastSelectedId(null);
  };

  const isSelected = (id: string) => selectedIds.has(id);

  return {
    selectedIds,
    handleSelect,
    clearSelection,
    isSelected,
  };
}
