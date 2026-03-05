import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MappingSuggestionResponse } from '~/types/llm';
import { useLlmStore } from './llm';

const mockGeneration: MappingSuggestionResponse = {
  generationId: 'gen-1',
  model: 'mock-model',
  promptVersion: 'v1',
  latencyMs: 120,
  suggestions: [
    {
      columnId: '0',
      suggestedVariableId: 'nb:Age',
      confidence: 0.91,
      rationale: 'Column name and values resemble age.',
      alternatives: [{ variableId: 'nb:Assessment', confidence: 0.2 }],
    },
  ],
};

describe('llm store', () => {
  it('handles request lifecycle and decisions', () => {
    const { result } = renderHook(() => useLlmStore());

    act(() => {
      result.current.actions.startRequest('req-1');
    });
    expect(result.current.status).toBe('loading');
    expect(result.current.requestId).toBe('req-1');

    act(() => {
      result.current.actions.completeRequest(mockGeneration);
    });
    expect(result.current.status).toBe('ready');
    expect(result.current.generation?.generationId).toBe('gen-1');
    expect(result.current.decisions['0']).toBe('pending');

    act(() => {
      result.current.actions.setDecision('0', 'applied');
    });
    expect(result.current.decisions['0']).toBe('applied');

    act(() => {
      result.current.actions.failRequest('err');
    });
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('err');

    act(() => {
      result.current.actions.reset();
    });
    expect(result.current.status).toBe('idle');
    expect(result.current.generation).toBeNull();
  });
});
