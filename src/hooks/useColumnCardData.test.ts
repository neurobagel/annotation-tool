import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataType, VariableType } from '../utils/internal_types';
import { useColumnCardData } from './useColumnCardData';

describe('useColumnCardData', () => {
  it('should map columns to card data correctly', () => {
    const columns = {
      col1: { id: 'col1', name: 'Column 1', allValues: [] },
      col2: {
        id: 'col2',
        name: 'Column 2',
        allValues: [],
        description: 'A description',
        dataType: DataType.continuous,
        standardizedVariable: 'var1',
      },
    };
    const standardizedVariables = {
      var1: { id: 'var1', name: 'Variable 1', variable_type: VariableType.continuous },
    };

    const { result } = renderHook(() => useColumnCardData(columns, standardizedVariables, {}));

    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toEqual({
      columnId: 'col1',
      name: 'Column 1',
      description: null,
      dataType: null,
      standardizedVariableId: null,
      termId: null,
      termLabel: null,
      termAbbreviation: null,
      isDataTypeEditable: true,
      inferredDataTypeLabel: null,
    });

    expect(result.current[1]).toEqual({
      columnId: 'col2',
      name: 'Column 2',
      description: 'A description',
      dataType: DataType.continuous,
      standardizedVariableId: 'var1',
      termId: null,
      termLabel: null,
      termAbbreviation: null,
      isDataTypeEditable: false,
      inferredDataTypeLabel: VariableType.continuous,
    });
  });

  it('should allow data type editing for multi-column measures', () => {
    const columns = {
      col1: {
        id: 'col1',
        name: 'Column 1',
        allValues: [],
        dataType: DataType.continuous,
        standardizedVariable: 'multi_var',
      },
    };
    const standardizedVariables = {
      multi_var: {
        id: 'multi_var',
        name: 'Multi Var',
        is_multi_column_measure: true,
        variable_type: VariableType.continuous,
      },
    };

    const { result } = renderHook(() => useColumnCardData(columns, standardizedVariables, {}));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].isDataTypeEditable).toBe(true);
    expect(result.current[0].inferredDataTypeLabel).toBe(null);
  });

  it('should map termId and resolve termLabel from standardizedTerms', () => {
    const columns = {
      col1: {
        id: 'col1',
        name: 'Column 1',
        allValues: [],
        isPartOf: 'termX',
      },
      col2: {
        id: 'col2',
        name: 'Column 2',
        allValues: [],
        isPartOf: 'termY',
      },
    };
    const standardizedVariables = {};
    const standardizedTerms = {
      termX: {
        id: 'termX',
        label: 'Term X Label',
        abbreviation: 'TX',
        standardizedVariableId: 'var1',
      },
    };

    const { result } = renderHook(() =>
      useColumnCardData(columns, standardizedVariables, standardizedTerms)
    );

    expect(result.current).toHaveLength(2);

    expect(result.current[0].termId).toBe('termX');
    expect(result.current[0].termLabel).toBe('Term X Label');
    expect(result.current[0].termAbbreviation).toBe('TX');

    expect(result.current[1].termId).toBe('termY');
    expect(result.current[1].termLabel).toBe(null);
    expect(result.current[1].termAbbreviation).toBe(null);
  });
});
