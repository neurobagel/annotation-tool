import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseMappingSuggestionResponse, requestMappingSuggestions } from './llmClient';

describe('parseMappingSuggestionResponse', () => {
  it('parses a valid response', () => {
    const result = parseMappingSuggestionResponse({
      generationId: 'gen-1',
      model: 'gpt',
      promptVersion: 'v1',
      latencyMs: 100,
      suggestions: [
        {
          columnId: '0',
          suggestedVariableId: 'nb:Age',
          confidence: 0.92,
          rationale: 'Looks like age.',
          alternatives: [{ variableId: 'nb:Assessment', confidence: 0.2 }],
        },
      ],
    });

    expect(result.generationId).toBe('gen-1');
    expect(result.suggestions[0].columnId).toBe('0');
    expect(result.suggestions[0].alternatives[0].variableId).toBe('nb:Assessment');
  });

  it('throws for invalid suggestion shape', () => {
    expect(() =>
      parseMappingSuggestionResponse({
        generationId: 'gen-1',
        model: 'gpt',
        promptVersion: 'v1',
        latencyMs: 100,
        suggestions: [{ columnId: 1 }],
      })
    ).toThrowError(/invalid/i);
  });
});

describe('requestMappingSuggestions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(
      requestMappingSuggestions({
        endpoint: 'http://localhost/mock',
        payload: {
          requestId: 'req-1',
          config: 'Neurobagel',
          columns: [],
          candidates: [],
        },
      })
    ).rejects.toThrow('500');
  });

  it('returns parsed response on ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        generationId: 'gen-1',
        model: 'gpt',
        promptVersion: 'v1',
        latencyMs: 100,
        suggestions: [
          {
            columnId: '0',
            suggestedVariableId: 'nb:Age',
            confidence: 0.92,
            rationale: 'Looks like age.',
            alternatives: [],
          },
        ],
      }),
    } as Response);

    const result = await requestMappingSuggestions({
      endpoint: 'http://localhost/mock',
      payload: {
        requestId: 'req-1',
        config: 'Neurobagel',
        columns: [],
        candidates: [],
      },
    });

    expect(result.generationId).toBe('gen-1');
    expect(result.suggestions).toHaveLength(1);
  });
});
