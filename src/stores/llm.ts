import { create } from 'zustand';
import { MappingSuggestionResponse, SuggestionDecision, SuggestionStatus } from '~/types/llm';

interface LlmState {
  status: SuggestionStatus;
  error: string | null;
  requestId: string | null;
  generation: MappingSuggestionResponse | null;
  decisions: Record<string, SuggestionDecision>;
  actions: {
    startRequest: (requestId: string) => void;
    completeRequest: (response: MappingSuggestionResponse) => void;
    failRequest: (message: string) => void;
    setDecision: (columnId: string, decision: SuggestionDecision) => void;
    reset: () => void;
  };
}

const initialState = {
  status: 'idle' as SuggestionStatus,
  error: null,
  requestId: null,
  generation: null,
  decisions: {},
};

const useLlmStore = create<LlmState>()((set) => ({
  ...initialState,
  actions: {
    startRequest: (requestId) =>
      set({
        status: 'loading',
        requestId,
        error: null,
      }),

    completeRequest: (generation) =>
      set({
        status: 'ready',
        generation,
        error: null,
        decisions: Object.fromEntries(
          generation.suggestions.map((suggestion) => [suggestion.columnId, 'pending'])
        ),
      }),

    failRequest: (message) =>
      set({
        status: 'error',
        error: message,
      }),

    setDecision: (columnId, decision) =>
      set((state) => ({
        decisions: {
          ...state.decisions,
          [columnId]: decision,
        },
      })),

    reset: () =>
      set({
        ...initialState,
      }),
  },
}));

export const useLlmStatus = () => useLlmStore((state) => state.status);
export const useLlmError = () => useLlmStore((state) => state.error);
export const useLlmRequestId = () => useLlmStore((state) => state.requestId);
export const useLlmGeneration = () => useLlmStore((state) => state.generation);
export const useLlmDecisions = () => useLlmStore((state) => state.decisions);
export const useLlmActions = () => useLlmStore((state) => state.actions);
export const useLlmStoreState = () => useLlmStore((state) => state);

export { useLlmStore };
