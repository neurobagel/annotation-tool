import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { mockDataTable, mockInitialColumns } from '~/utils/mocks';
import fs from 'fs';
import path from 'path';
import useDataStore from './data';

describe('store actions', () => {
  it('should process a file and update dataTable, columns, and uploadedDataTableFileName', async () => {
    const { result } = renderHook(() => useDataStore());

    const filePath = path.resolve(__dirname, '../../cypress/fixtures/examples/mock.tsv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const file = new File([fileContent], 'mock.tsv', { type: 'text/tab-separated-values' });

    await act(async () => {
      await result.current.processFile(file);
    });

    expect(result.current.dataTable).toEqual(mockDataTable);
    expect(result.current.columns).toEqual(mockInitialColumns);
    expect(result.current.uploadedDataTableFileName).toEqual('mock.tsv');
  });
});
