import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDataActions } from '~/stores/data';
import { DataStoreActions } from '../utils/internal_types';
import { useMultiColumnMeasureDraftCard } from './useMultiColumnMeasureDraftCard';

vi.mock('~/stores/data', () => ({
  useDataActions: vi.fn(),
}));

const mockedUseDataActions = vi.mocked(useDataActions);
const createMockActions = (): Pick<DataStoreActions, 'userCreatesCollection'> => ({
  userCreatesCollection: vi.fn(),
});

describe('useMultiColumnMeasureDraftCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create, promote, and remove a draft card', () => {
    const mockActions = createMockActions();
    const mockAction = vi.fn();
    mockActions.userCreatesCollection = mockAction;
    mockedUseDataActions.mockReturnValue(mockActions as DataStoreActions);

    const { result } = renderHook(() => useMultiColumnMeasureDraftCard('var-1'));

    expect(result.current.hasDraft).toBe(false);

    act(() => {
      result.current.createDraft();
    });

    expect(result.current.hasDraft).toBe(true);
    expect(result.current.draftMeasureCards).toHaveLength(1);

    const draftId = result.current.draftMeasureCards[0].id;

    act(() => {
      result.current.createCollectionFromDraft(draftId, 'term-1');
    });

    expect(mockAction).toHaveBeenCalledWith('term-1');
    expect(result.current.hasDraft).toBe(false);

    act(() => {
      result.current.removeDraft(draftId);
    });

    expect(result.current.hasDraft).toBe(false);
    expect(result.current.draftMeasureCards).toHaveLength(0);
  });

  it('should reset the draft when the active variable changes', () => {
    mockedUseDataActions.mockReturnValue(createMockActions() as DataStoreActions);

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
    mockedUseDataActions.mockReturnValue(createMockActions() as DataStoreActions);

    const { result } = renderHook(() => useMultiColumnMeasureDraftCard('var-1'));

    act(() => {
      result.current.createDraft();
      result.current.createDraft();
    });

    expect(result.current.draftMeasureCards).toHaveLength(1);
  });
});
