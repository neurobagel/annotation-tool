import { useEffect } from 'react';

interface UseColumnKeyboardShortcutsProps {
  columnId: string;
  isFocused: boolean;
  isDataTypeEditable: boolean;
  onDataTypeChange: (columnId: string, newDataType: 'Categorical' | 'Continuous' | null) => void;
}

export function useColumnKeyboardShortcuts({
  columnId,
  isFocused,
  isDataTypeEditable,
  onDataTypeChange,
}: UseColumnKeyboardShortcutsProps) {
  useEffect(() => {
    if (!isFocused || !isDataTypeEditable) {
      return undefined; // 🔥 explicit return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        onDataTypeChange(columnId, 'Categorical');
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onDataTypeChange(columnId, 'Continuous');
      } else if (e.key === 'Enter') {
        e.preventDefault();

        const cards = Array.from(
          document.querySelectorAll('[data-cy$="-column-annotation-card"]')
        ) as HTMLElement[];

        const currentIndex = cards.findIndex((card) => card === document.activeElement);

        if (currentIndex !== -1 && currentIndex < cards.length - 1) {
          cards[currentIndex + 1].focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused, isDataTypeEditable, columnId, onDataTypeChange]);
}
