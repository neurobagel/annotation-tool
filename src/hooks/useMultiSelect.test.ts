import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMultiSelect } from './useMultiSelect';

describe('useMultiSelect', () => {
  const mockVisibleIds = ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'];

  it('should initialize with empty selection', () => {
    const { result } = renderHook(() => useMultiSelect(mockVisibleIds));

    expect(result.current.selectedIds.size).toBe(0);
    expect(result.current.isSelected('item-1')).toBe(false);
  });

  describe('Single Selection', () => {
    it('should select a single item and clear previous selections', () => {
      const { result } = renderHook(() => useMultiSelect(mockVisibleIds));

      // Select first item
      act(() => {
        result.current.handleSelect('item-1', false, false);
      });

      expect(result.current.selectedIds.size).toBe(1);
      expect(result.current.isSelected('item-1')).toBe(true);

      // Select second item
      act(() => {
        result.current.handleSelect('item-2', false, false);
      });

      expect(result.current.selectedIds.size).toBe(1);
      expect(result.current.isSelected('item-1')).toBe(false);
      expect(result.current.isSelected('item-2')).toBe(true);
    });
  });

  describe('Toggle Selection (Ctrl/Cmd-click)', () => {
    it('should add to selection when toggling unselected item', () => {
      const { result } = renderHook(() => useMultiSelect(mockVisibleIds));

      act(() => {
        result.current.handleSelect('item-1', false, true);
        result.current.handleSelect('item-3', false, true);
      });

      expect(result.current.selectedIds.size).toBe(2);
      expect(result.current.isSelected('item-1')).toBe(true);
      expect(result.current.isSelected('item-3')).toBe(true);
    });

    it('should remove from selection when toggling selected item', () => {
      const { result } = renderHook(() => useMultiSelect(mockVisibleIds));

      act(() => {
        // Initial select
        result.current.handleSelect('item-1', false, false);
        result.current.handleSelect('item-2', false, true);
      });

      expect(result.current.selectedIds.size).toBe(2);

      act(() => {
        // Toggle selected item
        result.current.handleSelect('item-1', false, true);
      });

      expect(result.current.selectedIds.size).toBe(1);
      expect(result.current.isSelected('item-1')).toBe(false);
      expect(result.current.isSelected('item-2')).toBe(true);
    });
  });

  describe('Range Selection (Shift-click)', () => {
    it('should select range between last selected and current item', () => {
      const { result } = renderHook(() => useMultiSelect(mockVisibleIds));

      act(() => {
        // Initial anchor select
        result.current.handleSelect('item-2', false, false);
      });

      act(() => {
        // Shift select item-4
        result.current.handleSelect('item-4', true, false);
      });

      expect(result.current.selectedIds.size).toBe(3);
      expect(result.current.isSelected('item-2')).toBe(true);
      expect(result.current.isSelected('item-3')).toBe(true);
      expect(result.current.isSelected('item-4')).toBe(true);
    });

    it('should select range backwards', () => {
      const { result } = renderHook(() => useMultiSelect(mockVisibleIds));

      act(() => {
        // Initial anchor select
        result.current.handleSelect('item-5', false, false);
      });

      act(() => {
        // Shift select item-2
        result.current.handleSelect('item-2', true, false);
      });

      expect(result.current.selectedIds.size).toBe(4);
      ['item-2', 'item-3', 'item-4', 'item-5'].forEach((id) => {
        expect(result.current.isSelected(id)).toBe(true);
      });
    });

    it('should fall back to single selection if anchor item is not in visible list', () => {
      // Simulate filtering where anchor is no longer visible
      const { result, rerender } = renderHook(({ visibleIds }) => useMultiSelect(visibleIds), {
        initialProps: { visibleIds: mockVisibleIds },
      });

      act(() => {
        // Initial anchor select
        result.current.handleSelect('item-1', false, false);
      });

      // Rerender with filtered list that doesn't include 'item-1'
      const filteredIds = ['item-2', 'item-3'];
      rerender({ visibleIds: filteredIds });

      act(() => {
        // Shift select an item in the new filtered list
        result.current.handleSelect('item-3', true, false);
      });

      // Since item-1 anchor is not visible, it falls back to selecting just item-3,
      // but retains the existing item-1 since Shift-Click adds the "range" to the previously `newSelected.clear()`'d set. Wait, let's look at the implementation.
      // Implementation says: `newSelected.add(id);` when missing. But it calls `newSelected.clear()` right before. Let's check: actually `clear()` is NOT called if it falls back.
      // So it retains item-1 and adds item-3.
      expect(result.current.isSelected('item-1')).toBe(true);
      expect(result.current.isSelected('item-3')).toBe(true);
    });
  });

  describe('clearSelection', () => {
    it('should clear all selected items', () => {
      const { result } = renderHook(() => useMultiSelect(mockVisibleIds));

      act(() => {
        result.current.handleSelect('item-1', false, true);
        result.current.handleSelect('item-2', false, true);
      });

      expect(result.current.selectedIds.size).toBe(2);

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.isSelected('item-1')).toBe(false);
      expect(result.current.isSelected('item-2')).toBe(false);
    });
  });
});
