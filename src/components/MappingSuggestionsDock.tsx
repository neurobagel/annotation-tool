import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useMappingSuggestions } from '~/hooks/useMappingSuggestions';
import { useStandardizedVariableOptions } from '~/hooks/useStandardizedVariableOptions';
import { useColumns, useStandardizedVariables } from '~/stores/data';

const suggestionDecisionColor = (decision: string) => {
  if (decision === 'applied') return 'success' as const;
  if (decision === 'overridden') return 'warning' as const;
  if (decision === 'rejected') return 'default' as const;
  return 'primary' as const;
};

function MappingSuggestionsDock() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const standardizedVariableOptions = useStandardizedVariableOptions();
  const {
    status,
    error,
    generation,
    decisions,
    hasConfiguredEndpoint,
    generateSuggestions,
    applySuggestion,
    rejectSuggestion,
    applyOverride,
  } = useMappingSuggestions();
  const [overrides, setOverrides] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!generation) {
      setOverrides({});
      return;
    }

    setOverrides(
      Object.fromEntries(
        generation.suggestions.map((suggestion) => [
          suggestion.columnId,
          suggestion.suggestedVariableId,
        ])
      )
    );
  }, [generation]);

  const pendingSuggestions = useMemo(() => {
    if (!generation) {
      return [];
    }
    return generation.suggestions.filter(
      (suggestion) => decisions[suggestion.columnId] === 'pending'
    );
  }, [decisions, generation]);
  const disabledVariableIds = useMemo(
    () =>
      new Set(
        standardizedVariableOptions.filter((option) => option.disabled).map((option) => option.id)
      ),
    [standardizedVariableOptions]
  );

  const handleApplyAllPending = async () => {
    const toApply = pendingSuggestions.filter((suggestion) => {
      const overrideVariableId = overrides[suggestion.columnId] ?? suggestion.suggestedVariableId;
      return Boolean(
        overrideVariableId &&
        overrideVariableId === suggestion.suggestedVariableId &&
        !disabledVariableIds.has(overrideVariableId)
      );
    });

    await Promise.all(toApply.map((suggestion) => applySuggestion(suggestion)));
  };

  const handleGenerateSuggestions = async () => {
    await generateSuggestions();
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-2">
      <Paper elevation={2} className="rounded-xl border border-gray-200 p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography variant="h6" className="font-semibold">
              Mapping Assistant (Experimental)
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Generates variable mapping suggestions without changing existing mappings
              automatically.
            </Typography>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outlined"
              startIcon={
                status === 'loading' ? <CircularProgress size={14} /> : <AutoFixHighIcon />
              }
              disabled={status === 'loading' || !hasConfiguredEndpoint}
              onClick={handleGenerateSuggestions}
            >
              Generate Suggestions
            </Button>
            <Button
              variant="contained"
              disabled={pendingSuggestions.length === 0 || status === 'loading'}
              onClick={handleApplyAllPending}
            >
              Apply All Pending
            </Button>
          </div>
        </div>

        {!hasConfiguredEndpoint && (
          <Alert severity="info" className="mb-3">
            Set <code>NB_ENABLE_LLM_SUGGESTIONS=true</code> and{' '}
            <code>NB_LLM_SUGGESTIONS_ENDPOINT</code> to enable this feature.
          </Alert>
        )}

        {status === 'error' && error && (
          <Alert severity="error" className="mb-3">
            {error}
          </Alert>
        )}

        {generation && (
          <div className="flex flex-col gap-3">
            <Typography variant="caption" className="text-gray-500">
              Generation: {generation.generationId} | Model: {generation.model} | Prompt:{' '}
              {generation.promptVersion} | Latency: {generation.latencyMs}ms
            </Typography>

            {generation.suggestions.map((suggestion) => {
              const decision = decisions[suggestion.columnId] ?? 'pending';
              const columnName = columns[suggestion.columnId]?.name ?? suggestion.columnId;
              const suggestedLabel = suggestion.suggestedVariableId
                ? standardizedVariables[suggestion.suggestedVariableId]?.name ||
                  suggestion.suggestedVariableId
                : 'No confident suggestion';
              const suggestedIsDisabled = Boolean(
                suggestion.suggestedVariableId &&
                disabledVariableIds.has(suggestion.suggestedVariableId)
              );
              const selectedOverrideId =
                overrides[suggestion.columnId] ?? suggestion.suggestedVariableId ?? null;
              const selectedOverrideOption =
                standardizedVariableOptions.find((option) => option.id === selectedOverrideId) ||
                null;
              const hasOverride =
                selectedOverrideId !== null &&
                selectedOverrideId !== suggestion.suggestedVariableId;
              const confidencePct = Math.round(suggestion.confidence * 100);

              return (
                <div key={suggestion.columnId} className="rounded-lg border border-gray-200 p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Typography variant="subtitle2" className="font-semibold">
                      {columnName}
                    </Typography>
                    <Chip
                      size="small"
                      label={decision}
                      color={suggestionDecisionColor(decision)}
                      variant={decision === 'pending' ? 'outlined' : 'filled'}
                    />
                    <Chip size="small" label={`Confidence ${confidencePct}%`} variant="outlined" />
                  </div>

                  <Typography variant="body2" className="mb-1 text-gray-700">
                    Suggested variable: <strong>{suggestedLabel}</strong>
                  </Typography>
                  <Typography variant="body2" className="mb-3 text-gray-600">
                    {suggestion.rationale}
                  </Typography>
                  {suggestedIsDisabled && (
                    <Typography variant="caption" className="mb-2 block text-amber-700">
                      Suggested variable is unavailable for direct apply due to current mapping
                      constraints.
                    </Typography>
                  )}

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Autocomplete
                      size="small"
                      className="w-full sm:max-w-[360px]"
                      options={standardizedVariableOptions}
                      getOptionLabel={(option) => option.label}
                      getOptionDisabled={(option) => option.disabled}
                      value={selectedOverrideOption}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(_event, newValue) => {
                        setOverrides((state) => ({
                          ...state,
                          [suggestion.columnId]: newValue?.id ?? null,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...params}
                          placeholder="Override variable"
                          label="Override"
                        />
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckIcon />}
                        disabled={
                          decision !== 'pending' ||
                          !suggestion.suggestedVariableId ||
                          suggestedIsDisabled ||
                          hasOverride
                        }
                        onClick={async () => {
                          await applySuggestion(suggestion);
                        }}
                      >
                        Apply
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        disabled={decision !== 'pending' || !hasOverride || !selectedOverrideId}
                        onClick={async () => {
                          await applyOverride({
                            suggestion,
                            overrideVariableId: selectedOverrideId,
                          });
                        }}
                      >
                        Apply Override
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<CloseIcon />}
                        disabled={decision !== 'pending'}
                        onClick={async () => {
                          await rejectSuggestion(suggestion);
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Paper>
    </div>
  );
}

export default MappingSuggestionsDock;
