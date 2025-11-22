import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';
import type { Columns, StandardizedVariables } from '../../datamodel';
import { DataType, VariableType } from '../../datamodel';
import { useValueAnnotationColumns } from './useValueAnnotationColumns';

vi.mock('~/stores/FreshNewStore', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);

describe('useValueAnnotationColumns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should group annotated columns by standardized variable', () => {
    const columns: Columns = {
      '1': {
        id: '1',
        name: 'Age 1',
        allValues: [],
        dataType: DataType.continuous,
        standardizedVariable: 'nb:Age',
      },
      '2': {
        id: '2',
        name: 'Age 2',
        allValues: [],
        dataType: DataType.continuous,
        standardizedVariable: 'nb:Age',
      },
      '3': {
        id: '3',
        name: 'Sex',
        allValues: [],
        dataType: DataType.categorical,
        standardizedVariable: 'nb:Sex',
      },
      '4': {
        id: '4',
        name: 'Participant ID',
        allValues: [],
        dataType: DataType.categorical,
        standardizedVariable: 'nb:ParticipantID',
      },
    };
    const variables: StandardizedVariables = {
      'nb:Age': { id: 'nb:Age', name: 'Age' },
      'nb:Sex': { id: 'nb:Sex', name: 'Sex' },
      'nb:ParticipantID': {
        id: 'nb:ParticipantID',
        name: 'Participant ID',
        variable_type: VariableType.identifier,
      },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue(variables);

    const { result } = renderHook(() => useValueAnnotationColumns());

    expect(result.current.annotatedColumnGroups).toHaveLength(2);
    const ageGroup = result.current.annotatedColumnGroups.find(
      (group) => group.standardizedVariableId === 'nb:Age'
    );
    expect(ageGroup?.columns).toHaveLength(2);
    expect(ageGroup?.label).toBe('Age');

    const sexGroup = result.current.annotatedColumnGroups.find(
      (group) => group.standardizedVariableId === 'nb:Sex'
    );
    expect(sexGroup?.columns[0].id).toBe('3');
  });

  it('should group unannotated columns by data type and fall back to other', () => {
    const columns: Columns = {
      '1': { id: '1', name: 'Categorical', allValues: [], dataType: DataType.categorical },
      '2': { id: '2', name: 'Continuous', allValues: [], dataType: DataType.continuous },
      '3': { id: '3', name: 'Other', allValues: [] },
    };

    mockedUseColumns.mockReturnValue(columns);
    mockedUseStandardizedVariables.mockReturnValue({});

    const { result } = renderHook(() => useValueAnnotationColumns());

    const categoricalGroup = result.current.unannotatedColumnGroups.find(
      (group) => group.key === DataType.categorical
    );
    expect(categoricalGroup?.columns).toHaveLength(1);

    const continuousGroup = result.current.unannotatedColumnGroups.find(
      (group) => group.key === DataType.continuous
    );
    expect(continuousGroup?.columns).toHaveLength(1);

    const otherGroup = result.current.unannotatedColumnGroups.find(
      (group) => group.key === 'other'
    );
    expect(otherGroup?.columns).toHaveLength(1);
  });
});
