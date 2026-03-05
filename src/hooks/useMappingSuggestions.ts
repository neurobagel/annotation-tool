import { useCallback } from 'react';
import { requestMappingSuggestions } from '~/api/llmClient';
import { logAuditEvent } from '~/services/auditLogger';
import { useColumns, useConfig, useDataActions, useStandardizedVariables } from '~/stores/data';
import {
  useLlmActions,
  useLlmDecisions,
  useLlmError,
  useLlmGeneration,
  useLlmStatus,
} from '~/stores/llm';
import { AuditEvent, MappingSuggestion } from '~/types/llm';
import {
  buildMappingSuggestionRequest,
  getLlmSuggestionsEndpoint,
  isLlmSuggestionsEnabled,
} from '~/utils/llm-utils';

const buildAuditEvent = ({
  eventName,
  payload,
  generationId,
}: {
  eventName: AuditEvent['eventName'];
  payload: AuditEvent['payload'];
  generationId?: string;
}): AuditEvent => ({
  eventId: crypto.randomUUID(),
  eventName,
  generationId,
  occurredAt: new Date().toISOString(),
  payload,
});

export function useMappingSuggestions() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const config = useConfig();
  const { userUpdatesColumnStandardizedVariable } = useDataActions();
  const llmStatus = useLlmStatus();
  const llmError = useLlmError();
  const llmGeneration = useLlmGeneration();
  const llmDecisions = useLlmDecisions();
  const llmActions = useLlmActions();

  const endpoint = getLlmSuggestionsEndpoint();
  const hasConfiguredEndpoint = isLlmSuggestionsEnabled() && endpoint !== '';

  const generateSuggestions = useCallback(async () => {
    if (!hasConfiguredEndpoint) {
      llmActions.failRequest(
        'LLM suggestions are disabled or endpoint is missing. Set NB_ENABLE_LLM_SUGGESTIONS and NB_LLM_SUGGESTIONS_ENDPOINT.'
      );
      return;
    }

    const requestId = crypto.randomUUID();
    llmActions.startRequest(requestId);

    const payload = buildMappingSuggestionRequest({
      requestId,
      config,
      columns,
      standardizedVariables,
    });

    await logAuditEvent(
      buildAuditEvent({
        eventName: 'llm.request.started',
        payload: {
          requestId,
          config,
          columnCount: payload.columns.length,
          candidateCount: payload.candidates.length,
        },
      })
    );

    try {
      const response = await requestMappingSuggestions({
        endpoint,
        payload,
      });
      llmActions.completeRequest(response);

      await logAuditEvent(
        buildAuditEvent({
          eventName: 'llm.request.succeeded',
          generationId: response.generationId,
          payload: {
            requestId,
            model: response.model,
            promptVersion: response.promptVersion,
            suggestionCount: response.suggestions.length,
            latencyMs: response.latencyMs,
          },
        })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown LLM error';
      llmActions.failRequest(message);

      await logAuditEvent(
        buildAuditEvent({
          eventName: 'llm.request.failed',
          payload: {
            requestId,
            message,
          },
        })
      );
    }
  }, [columns, config, endpoint, hasConfiguredEndpoint, llmActions, standardizedVariables]);

  const applySuggestion = useCallback(
    async (suggestion: MappingSuggestion) => {
      if (!suggestion.suggestedVariableId) {
        return;
      }

      userUpdatesColumnStandardizedVariable(suggestion.columnId, suggestion.suggestedVariableId);
      llmActions.setDecision(suggestion.columnId, 'applied');

      await logAuditEvent(
        buildAuditEvent({
          eventName: 'llm.suggestion.applied',
          generationId: llmGeneration?.generationId,
          payload: {
            columnId: suggestion.columnId,
            suggestedVariableId: suggestion.suggestedVariableId,
            confidence: suggestion.confidence,
          },
        })
      );
    },
    [llmActions, llmGeneration?.generationId, userUpdatesColumnStandardizedVariable]
  );

  const rejectSuggestion = useCallback(
    async (suggestion: MappingSuggestion) => {
      llmActions.setDecision(suggestion.columnId, 'rejected');

      await logAuditEvent(
        buildAuditEvent({
          eventName: 'llm.suggestion.rejected',
          generationId: llmGeneration?.generationId,
          payload: {
            columnId: suggestion.columnId,
            suggestedVariableId: suggestion.suggestedVariableId,
            confidence: suggestion.confidence,
          },
        })
      );
    },
    [llmActions, llmGeneration?.generationId]
  );

  const applyOverride = useCallback(
    async ({
      suggestion,
      overrideVariableId,
    }: {
      suggestion: MappingSuggestion;
      overrideVariableId: string | null;
    }) => {
      if (!overrideVariableId) {
        return;
      }

      userUpdatesColumnStandardizedVariable(suggestion.columnId, overrideVariableId);
      llmActions.setDecision(suggestion.columnId, 'overridden');

      await logAuditEvent(
        buildAuditEvent({
          eventName: 'llm.suggestion.overridden',
          generationId: llmGeneration?.generationId,
          payload: {
            columnId: suggestion.columnId,
            suggestedVariableId: suggestion.suggestedVariableId,
            overrideVariableId,
            confidence: suggestion.confidence,
          },
        })
      );
    },
    [llmActions, llmGeneration?.generationId, userUpdatesColumnStandardizedVariable]
  );

  const resetSuggestions = useCallback(() => {
    llmActions.reset();
  }, [llmActions]);

  return {
    hasConfiguredEndpoint,
    status: llmStatus,
    error: llmError,
    generation: llmGeneration,
    decisions: llmDecisions,
    generateSuggestions,
    applySuggestion,
    rejectSuggestion,
    applyOverride,
    resetSuggestions,
  };
}
