import {
  MappingSuggestion,
  MappingSuggestionResponse,
  MappingSuggestionRequest,
} from '~/types/llm';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

function parseSuggestion(value: unknown): MappingSuggestion {
  if (!isObject(value)) {
    throw new Error('LLM response is invalid: suggestion is not an object.');
  }

  const { columnId, suggestedVariableId, confidence, rationale, alternatives } = value;

  if (!isString(columnId)) {
    throw new Error('LLM response is invalid: columnId is missing or invalid.');
  }
  if (!(isString(suggestedVariableId) || suggestedVariableId === null)) {
    throw new Error('LLM response is invalid: suggestedVariableId is invalid.');
  }
  if (!isNumber(confidence)) {
    throw new Error('LLM response is invalid: confidence is missing or invalid.');
  }
  if (!isString(rationale)) {
    throw new Error('LLM response is invalid: rationale is missing or invalid.');
  }
  if (!Array.isArray(alternatives)) {
    throw new Error('LLM response is invalid: alternatives must be an array.');
  }

  return {
    columnId,
    suggestedVariableId,
    confidence,
    rationale,
    alternatives: alternatives.map((alternative) => {
      if (!isObject(alternative)) {
        throw new Error('LLM response is invalid: alternative is not an object.');
      }

      const { variableId, confidence: alternativeConfidence } = alternative;
      if (!isString(variableId) || !isNumber(alternativeConfidence)) {
        throw new Error('LLM response is invalid: alternative fields are invalid.');
      }

      return {
        variableId,
        confidence: alternativeConfidence,
      };
    }),
  };
}

export function parseMappingSuggestionResponse(data: unknown): MappingSuggestionResponse {
  if (!isObject(data)) {
    throw new Error('LLM response is invalid.');
  }

  const { generationId, model, promptVersion, latencyMs, suggestions } = data;
  if (!isString(generationId)) {
    throw new Error('LLM response is invalid: generationId missing.');
  }
  if (!isString(model)) {
    throw new Error('LLM response is invalid: model missing.');
  }
  if (!isString(promptVersion)) {
    throw new Error('LLM response is invalid: promptVersion missing.');
  }
  if (!isNumber(latencyMs)) {
    throw new Error('LLM response is invalid: latencyMs missing.');
  }
  if (!Array.isArray(suggestions)) {
    throw new Error('LLM response is invalid: suggestions array missing.');
  }

  return {
    generationId,
    model,
    promptVersion,
    latencyMs,
    suggestions: suggestions.map((suggestion) => parseSuggestion(suggestion)),
  };
}

export async function requestMappingSuggestions({
  endpoint,
  payload,
}: {
  endpoint: string;
  payload: MappingSuggestionRequest;
}): Promise<MappingSuggestionResponse> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`LLM suggestions request failed: ${response.status}`);
  }

  const responseJson: unknown = await response.json();
  return parseMappingSuggestionResponse(responseJson);
}
