import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStandardizedTerms } from '../stores/FreshNewStore';
import { UsePersistedMultiColumnCardsOutput } from './usePersistedMultiColumnCards';

export interface DraftCard {
  id: string;
  termId?: string | null;
}

interface UseMultiColumnDraftCardOutput {
  hasDraft: boolean;
  draftMeasureCards: UsePersistedMultiColumnCardsOutput[];
  createDraft: () => void;
  updateDraftTerm: (cardId: string, termId: string | null) => void;
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
  const standardizedTerms = useStandardizedTerms();

  useEffect(() => {
    setDraftCard(null);
  }, [activeVariableId]);

  const draftMeasureCards: UsePersistedMultiColumnCardsOutput[] = draftCard
    ? [
        {
          id: draftCard.id,
          term: draftCard.termId ? standardizedTerms[draftCard.termId] || null : null,
          mappedColumns: [],
        },
      ]
    : [];

  // keep callbacks stable so downstream components don't rerender when references change
  const createDraft = useCallback(() => {
    if (!activeVariableId || draftCard) return;
    setDraftCard({ id: uuidv4(), termId: null });
  }, [activeVariableId, draftCard]);

  const updateDraftTerm = useCallback((cardId: string, termId: string | null) => {
    setDraftCard((prev) => (prev && prev.id === cardId ? { ...prev, termId } : prev));
  }, []);

  const removeDraft = useCallback((cardId: string) => {
    setDraftCard((prev) => (prev && prev.id === cardId ? null : prev));
  }, []);

  return {
    hasDraft: !!draftCard,
    draftMeasureCards,
    createDraft,
    updateDraftTerm,
    removeDraft,
  };
}
