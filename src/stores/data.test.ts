import { act, renderHook } from '@testing-library/react';
import fs from 'fs';
import { produce } from 'immer';
import path from 'path';
import { beforeEach, describe, it, expect } from 'vitest';
import { mockDataTable, mockInitialColumns, mockColumns } from '~/utils/mocks';
import { Columns } from '../utils/types';
import useDataStore from './data';

describe('data store actions', () => {
  beforeEach(async () => {
    const { result } = renderHook(() => useDataStore());

    result.current.reset();

    const dataTableFilePath = path.resolve(__dirname, '../../cypress/fixtures/examples/mock.tsv');
    const dataTableFileContent = fs.readFileSync(dataTableFilePath, 'utf-8');
    const dataTableFile = new File([dataTableFileContent], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    await act(async () => {
      await result.current.processDataTableFile(dataTableFile);
    });
  });
  it('processes a data table file and update dataTable, columns, and uploadedDataTableFileName', async () => {
    const { result } = renderHook(() => useDataStore());

    expect(result.current.dataTable).toEqual(mockDataTable);
    expect(result.current.columns).toEqual(mockInitialColumns);
    expect(result.current.uploadedDataTableFileName).toEqual('mock.tsv');
  });

  it('processes a data dictionary file and update columns and uploadedDataDictionaryFileName', async () => {
    const { result } = renderHook(() => useDataStore());

    // Set the initial columns to `mockInitialColumns`
    act(() => {
      result.current.initializeColumns(mockInitialColumns);
    });

    const dataDictionaryFilePath = path.resolve(
      __dirname,
      '../../cypress/fixtures/examples/mock.json'
    );
    const dataDictionaryFileContent = fs.readFileSync(dataDictionaryFilePath, 'utf-8');
    const dataDictionaryFile = new File([dataDictionaryFileContent], 'mock.json', {
      type: 'application/json',
    });

    await act(async () => {
      await result.current.processDataDictionaryFile(dataDictionaryFile);
    });

    expect(result.current.columns).toEqual(mockColumns);
    expect(result.current.uploadedDataDictionaryFileName).toEqual('mock.json');

    act(() => {
      // Use a different variable name to avoid shadowing
      const updatedColumns = produce(mockInitialColumns as Columns, (draft) => {
        draft[1].description = 'some description';
      });
      result.current.initializeColumns(updatedColumns);
    });
    expect(result.current.columns['1'].description).toEqual('some description');

    await act(async () => {
      await result.current.processDataDictionaryFile(dataDictionaryFile);
    });
    expect(result.current.columns).toEqual(mockColumns);
    expect(result.current.uploadedDataDictionaryFileName).toEqual('mock.json');
  });

  it('updates the description field of a column', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.updateColumnDescription('1', 'some description');
    });
    expect(result.current.columns['1'].description).toEqual('some description');
  });

  it('updates the dataType field of a column', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.dataTable = mockDataTable;
      result.current.updateColumnDataType('1', 'Continuous');
      result.current.updateColumnDataType('3', 'Categorical');
    });
    expect(result.current.columns['1'].dataType).toEqual('Continuous');
    expect(result.current.columns['1'].levels).toBeUndefined();
    expect(result.current.columns['1'].units).toEqual('');
    expect(result.current.columns['3'].dataType).toEqual('Categorical');
    expect(result.current.columns['3'].levels).toBeDefined();
    expect(result.current.columns['3'].levels).toEqual({
      F: { description: '' },
      M: { description: '' },
    });
  });

  it('updates the standardizedVariable field of a column', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.updateColumnStandardizedVariable('1', {
        identifier: 'nb:Some',
        label: 'Some',
      });
    });
    expect(result.current.columns['1'].standardizedVariable).toEqual({
      identifier: 'nb:Some',
      label: 'Some',
    });
  });
  it("sets the standardizedVariable field of a column and consequently modifies the column's dataType field", () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.updateColumnStandardizedVariable('1', {
        identifier: 'nb:AssessmentTool',
        label: 'Assessment Tool',
      });
    });
    expect(result.current.columns['1'].standardizedVariable).toEqual({
      identifier: 'nb:AssessmentTool',
      label: 'Assessment Tool',
    });
    expect(result.current.columns['1'].dataType).toEqual('Categorical');
    expect(result.current.columns['1'].levels).toBeDefined();
    act(() => {
      result.current.updateColumnStandardizedVariable('1', {
        identifier: 'nb:Age',
        label: 'Age',
      });
    });
    expect(result.current.columns['1'].standardizedVariable).toEqual({
      identifier: 'nb:Age',
      label: 'Age',
    });
    expect(result.current.columns['1'].dataType).toEqual('Continuous');
    expect(result.current.columns['1'].levels).toBeUndefined();
    expect(result.current.columns['1'].units).toEqual('');
  });
  it('sets the standardizedVariable field of a column to Assessment Tool', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.updateColumnStandardizedVariable('1', {
        identifier: 'nb:AssessmentTool',
        label: 'Assessment Tool',
      });
    });
    expect(result.current.columns['1'].standardizedVariable).toEqual({
      identifier: 'nb:AssessmentTool',
      label: 'Assessment Tool',
    });
    expect(result.current.columns['1'].isPartOf).toEqual({});
  });
  it('updates the isPartOf field of a column', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.updateColumnStandardizedVariable('1', {
        identifier: 'nb:AssessmentTool',
        label: 'Assessment Tool',
      });
      result.current.updateColumnIsPartOf('1', {
        identifier: 'some identifier',
        label: 'some label',
      });
    });
    expect(result.current.columns['1'].isPartOf).toEqual({
      termURL: 'some identifier',
      label: 'some label',
    });
  });
  it('updates the description for a level of a categorical column', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.updateColumnDataType('3', 'Categorical');
      result.current.updateColumnLevelDescription('3', 'F', 'some description');
    });
    expect(result.current.columns['3'].levels).toEqual({
      F: { description: 'some description' },
      M: { description: '' },
    });
  });
  it('updates the units field of a column', () => {
    const { result } = renderHook(() => useDataStore());
    act(() => {
      result.current.updateColumnDataType('1', 'Continuous');
      result.current.updateColumnUnits('1', 'some units');
    });
    expect(result.current.columns['1'].units).toEqual('some units');
  });
});
