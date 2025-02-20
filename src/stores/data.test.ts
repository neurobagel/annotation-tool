import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { mockDataTable, mockInitialColumns, mockUpdatedColumns } from '~/utils/mocks';
import fs from 'fs';
import path from 'path';
import useDataStore from './data';

describe('store actions', () => {
  it('should process a data table file and update dataTable, columns, and uploadedDataTableFileName', async () => {
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

  it('should process a data dictionary file and update columns and uploadedDataDictionaryFileName', async () => {
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

    expect(result.current.columns).toEqual(mockUpdatedColumns);
    expect(result.current.uploadedDataDictionaryFileName).toEqual('mock.json');
  });
});
