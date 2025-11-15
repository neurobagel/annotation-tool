import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStandardizedTerms } from '~/stores/FreshNewStore';
import { useMultiColumnMeasureDraftCard } from './useMultiColumnMeasureDraftCard';

vi.mock('~/stores/FreshNewStore', () => ({
  useStandardizedTerms: vi.fn(),
}));

const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);

describe('useMultiColumnMeasureDraftCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create, update, and remove a draft card', () => {
    mockedUseStandardizedTerms.mockReturnValue({
      'term-1': { id: 'term-1', label: 'Term 1', standardizedVariableId: 'var-1' },
    });

    const { result } = renderHook(() => useMultiColumnMeasureDraftCard('var-1'));

    expect(result.current.hasDraft).toBe(false);

    act(() => {
      result.current.createDraft();
    });

    expect(result.current.hasDraft).toBe(true);
    expect(result.current.draftMeasureCards).toHaveLength(1);

    const draftId = result.current.draftMeasureCards[0].id;

    act(() => {
      result.current.updateDraftTerm(draftId, 'term-1');
    });

    expect(result.current.draftMeasureCards[0].term?.id).toBe('term-1');

    act(() => {
      result.current.removeDraft(draftId);
    });

    expect(result.current.hasDraft).toBe(false);
    expect(result.current.draftMeasureCards).toHaveLength(0);
  });

  it('should reset the draft when the active variable changes', () => {
    mockedUseStandardizedTerms.mockReturnValue({});

    const { result, rerender } = renderHook(
      ({ variableId }) => useMultiColumnMeasureDraftCard(variableId),
      { initialProps: { variableId: 'var-1' } }
    );

    act(() => {
      result.current.createDraft();
    });

    expect(result.current.hasDraft).toBe(true);

    rerender({ variableId: 'var-2' });

    expect(result.current.hasDraft).toBe(false);
  });

  it('should not create multiple drafts', () => {
    mockedUseStandardizedTerms.mockReturnValue({});

    const { result } = renderHook(() => useMultiColumnMeasureDraftCard('var-1'));

    act(() => {
      result.current.createDraft();
      result.current.createDraft();
    });

    expect(result.current.draftMeasureCards).toHaveLength(1);
  });
});
