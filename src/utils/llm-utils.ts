import { LlmVariableCandidate, MappingSuggestionRequest } from '~/types/llm';
import { Columns, StandardizedVariables } from './internal_types';

const MAX_SAMPLE_VALUES = 20;

const uniqueNonEmptyValues = (values: string[]): string[] => {
  const deduped = Array.from(new Set(values));
  return deduped.filter((value) => value !== '');
};

export function isLlmSuggestionsEnabled(): boolean {
  return (import.meta.env.NB_ENABLE_LLM_SUGGESTIONS ?? 'false').toLowerCase() === 'true';
}

export function getLlmSuggestionsEndpoint(): string {
  return (import.meta.env.NB_LLM_SUGGESTIONS_ENDPOINT ?? '').trim();
}

export function getLlmAuditEndpoint(): string {
  return (import.meta.env.NB_LLM_AUDIT_ENDPOINT ?? '').trim();
}

export function buildLlmVariableCandidates(
  standardizedVariables: StandardizedVariables
): LlmVariableCandidate[] {
  return Object.values(standardizedVariables)
    .map((variable) => ({
      id: variable.id,
      label: variable.name,
      description: variable.description,
      variableType: variable.variable_type,
      isMultiColumnMeasure: variable.is_multi_column_measure,
      canHaveMultipleColumns: variable.can_have_multiple_columns,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function buildMappingSuggestionRequest({
  requestId,
  config,
  columns,
  standardizedVariables,
}: {
  requestId: string;
  config: string;
  columns: Columns;
  standardizedVariables: StandardizedVariables;
}): MappingSuggestionRequest {
  const payloadColumns = Object.entries(columns).map(([columnId, column]) => ({
    columnId,
    name: column.name,
    description: column.description ?? null,
    sampleValues: uniqueNonEmptyValues(column.allValues).slice(0, MAX_SAMPLE_VALUES),
    currentMapping: column.standardizedVariable ?? null,
  }));

  return {
    requestId,
    config,
    columns: payloadColumns,
    candidates: buildLlmVariableCandidates(standardizedVariables),
  };
}
