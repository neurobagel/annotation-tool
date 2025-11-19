import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFreshDataActions } from '~/stores/FreshNewStore';
import { FreshDataStoreActions } from '../../datamodel';
import { useMultiColumnMeasureDraftCard } from './useMultiColumnMeasureDraftCard';

vi.mock('~/stores/FreshNewStore', () => ({
  useFreshDataActions: vi.fn(),
}));

const mockedUseFreshDataActions = vi.mocked(useFreshDataActions);
const createMockActions = (): FreshDataStoreActions => ({
  loadConfig: vi.fn(),
  appFetchesConfigOptions: vi.fn(),
  userSelectsConfig: vi.fn(),
  userUploadsDataTableFile: vi.fn(),
  userUploadsDataDictionaryFile: vi.fn(),
  userUpdatesColumnDescription: vi.fn(),
  userUpdatesColumnDataType: vi.fn(),
  userUpdatesColumnStandardizedVariable: vi.fn(),
  userUpdatesColumnToCollectionMapping: vi.fn(),
  userCreatesCollection: vi.fn(),
  userDeletesCollection: vi.fn(),
  reset: vi.fn(),
});

describe('useMultiColumnMeasureDraftCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create, promote, and remove a draft card', () => {
    const mockActions = createMockActions();
    const mockAction = vi.fn();
    mockActions.userCreatesCollection = mockAction;
    mockedUseFreshDataActions.mockReturnValue(mockActions);

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
    mockedUseFreshDataActions.mockReturnValue(createMockActions());

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
    mockedUseFreshDataActions.mockReturnValue(createMockActions());

    const { result } = renderHook(() => useMultiColumnMeasureDraftCard('var-1'));

    act(() => {
      result.current.createDraft();
      result.current.createDraft();
    });

    expect(result.current.draftMeasureCards).toHaveLength(1);
  });
});
