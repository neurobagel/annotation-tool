import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { mockDataTable, mockInitialColumns, mockColumnsWithDescription } from '~/utils/mocks';
import fs from 'fs';
import path from 'path';
import { produce } from 'immer';
import useDataStore from './data';
import { Columns } from '../utils/types';

describe('data store actions', () => {
  it('processes a data table file and update dataTable, columns, and uploadedDataTableFileName', async () => {
    const { result } = renderHook(() => useDataStore());

    const dataTableFilePath = path.resolve(__dirname, '../../cypress/fixtures/examples/mock.tsv');
    const dataTableFileContent = fs.readFileSync(dataTableFilePath, 'utf-8');
    const dataTableFile = new File([dataTableFileContent], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    await act(async () => {
      await result.current.processDataTableFile(dataTableFile);
    });

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

    expect(result.current.columns).toEqual(mockColumnsWithDescription);
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
    expect(result.current.columns).toEqual(mockColumnsWithDescription);
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
  it('updates the description for a level of a categorical column', () => {
    const { result } = renderHook(() => useDataStore());
    // We have already declared this column as categorical in a previous test
    act(() => {
      result.current.updateColumnLevelDescription('3', 'F', 'some description');
    });
    expect(result.current.columns['3'].levels).toEqual({
      F: { description: 'some description' },
      M: { description: '' },
    });
  });
});
