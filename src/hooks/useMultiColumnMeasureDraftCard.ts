import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDataActions } from '../stores/data';
import { UsePersistedMultiColumnCardsOutput } from './usePersistedMultiColumnCards';

export interface DraftCard {
  id: string;
}

interface UseMultiColumnDraftCardOutput {
  hasDraft: boolean;
  draftMeasureCards: UsePersistedMultiColumnCardsOutput[];
  createDraft: () => void;
  createCollectionFromDraft: (cardId: string, termId: string | null) => void;
  removeDraft: (cardId: string) => void;
}

/**
 * Manages a single draft card for multi-column measures. Users
 * explicitly create the draft, and it is cleared whenever the active variable changes.
 */
export function useMultiColumnMeasureDraftCard(
  activeVariableId: string
): UseMultiColumnDraftCardOutput {
  const [draftCard, setDraftCard] = useState<DraftCard | null>(null);
  const { userCreatesCollection } = useDataActions();

  useEffect(() => {
    setDraftCard(null);
  }, [activeVariableId]);

  const draftMeasureCards: UsePersistedMultiColumnCardsOutput[] = draftCard
    ? [
        {
          id: draftCard.id,
          term: null,
          mappedColumns: [],
        },
      ]
    : [];

  // keep callbacks stable so downstream components don't rerender when references change
  const createDraft = useCallback(() => {
    if (!activeVariableId || draftCard) return;
    setDraftCard({ id: uuidv4() });
  }, [activeVariableId, draftCard]);

  const createCollectionFromDraft = useCallback(
    (cardId: string, termId: string | null) => {
      if (!termId) return;
      setDraftCard((prev) => {
        if (!prev || prev.id !== cardId) {
          return prev;
        }
        userCreatesCollection(termId);
        return null;
      });
    },
    [userCreatesCollection]
  );

  const removeDraft = useCallback((cardId: string) => {
    setDraftCard((prev) => (prev && prev.id === cardId ? null : prev));
  }, []);

  return {
    hasDraft: !!draftCard,
    draftMeasureCards,
    createDraft,
    createCollectionFromDraft,
    removeDraft,
  };
}
