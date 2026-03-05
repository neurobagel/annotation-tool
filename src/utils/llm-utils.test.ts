import { describe, expect, it } from 'vitest';
import { Columns, StandardizedVariables, VariableType } from './internal_types';
import { buildLlmVariableCandidates, buildMappingSuggestionRequest } from './llm-utils';

describe('buildLlmVariableCandidates', () => {
  it('sorts candidates by label and maps variable metadata', () => {
    const standardizedVariables: StandardizedVariables = {
      'nb:Zeta': {
        id: 'nb:Zeta',
        name: 'Zeta Variable',
        variable_type: VariableType.categorical,
        can_have_multiple_columns: false,
      },
      'nb:Alpha': {
        id: 'nb:Alpha',
        name: 'Alpha Variable',
        variable_type: VariableType.continuous,
        is_multi_column_measure: true,
      },
    };

    const result = buildLlmVariableCandidates(standardizedVariables);

    expect(result.map((candidate) => candidate.id)).toEqual(['nb:Alpha', 'nb:Zeta']);
    expect(result[0]).toMatchObject({
      id: 'nb:Alpha',
      label: 'Alpha Variable',
      variableType: VariableType.continuous,
      isMultiColumnMeasure: true,
    });
  });
});

describe('buildMappingSuggestionRequest', () => {
  it('creates request payload with deduplicated, non-empty, bounded samples', () => {
    const manyValues = Array.from({ length: 30 }, (_, index) => `value-${index}`);
    const columns: Columns = {
      '0': {
        id: '0',
        name: 'age',
        description: 'Age in years',
        allValues: ['', '30', '30', '31', ...manyValues],
        standardizedVariable: 'nb:Age',
      },
    };

    const standardizedVariables: StandardizedVariables = {
      'nb:Age': {
        id: 'nb:Age',
        name: 'Age',
        variable_type: VariableType.continuous,
      },
    };

    const result = buildMappingSuggestionRequest({
      requestId: 'req-1',
      config: 'Neurobagel',
      columns,
      standardizedVariables,
    });

    expect(result.requestId).toBe('req-1');
    expect(result.config).toBe('Neurobagel');
    expect(result.columns).toHaveLength(1);
    expect(result.columns[0]).toMatchObject({
      columnId: '0',
      name: 'age',
      description: 'Age in years',
      currentMapping: 'nb:Age',
    });
    expect(result.columns[0].sampleValues).not.toContain('');
    expect(new Set(result.columns[0].sampleValues).size).toBe(
      result.columns[0].sampleValues.length
    );
    expect(result.columns[0].sampleValues.length).toBeLessThanOrEqual(20);
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0].id).toBe('nb:Age');
  });
});
