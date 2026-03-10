export interface LlmVariableCandidate {
  id: string;
  label: string;
  description?: string;
  variableType?: string;
  isMultiColumnMeasure?: boolean;
  canHaveMultipleColumns?: boolean;
}

export interface LlmColumnContext {
  columnId: string;
  name: string;
  description: string | null;
  sampleValues: string[];
  currentMapping: string | null;
}

export interface MappingSuggestionRequest {
  requestId: string;
  config: string;
  columns: LlmColumnContext[];
  candidates: LlmVariableCandidate[];
}

export interface MappingSuggestionAlternative {
  variableId: string;
  confidence: number;
}

export interface MappingSuggestion {
  columnId: string;
  suggestedVariableId: string | null;
  confidence: number;
  rationale: string;
  alternatives: MappingSuggestionAlternative[];
}

export interface MappingSuggestionResponse {
  generationId: string;
  model: string;
  promptVersion: string;
  latencyMs: number;
  suggestions: MappingSuggestion[];
}

export type SuggestionDecision = 'pending' | 'applied' | 'rejected' | 'overridden';
export type SuggestionStatus = 'idle' | 'loading' | 'ready' | 'error';

export type AuditEventName =
  | 'llm.request.started'
  | 'llm.request.succeeded'
  | 'llm.request.failed'
  | 'llm.suggestion.applied'
  | 'llm.suggestion.rejected'
  | 'llm.suggestion.overridden';

export interface AuditEvent {
  eventId: string;
  eventName: AuditEventName;
  generationId?: string;
  occurredAt: string;
  payload: Record<string, unknown>;
}
