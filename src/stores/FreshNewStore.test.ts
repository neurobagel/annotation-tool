import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mockDataDictionaryRaw from '../../cypress/fixtures/examples/mock.json?raw';
import mockTsvRaw from '../../cypress/fixtures/examples/mock.tsv?raw';
import { DataType } from '../../datamodel';
import {
  mockAvailableConfigOptions,
  mockFreshConfigFile,
  mockFreshTermsData,
  mockFreshStandardizedVariables,
  mockFreshStandardizedTerms,
  mockFreshStandardizedFormats,
  mockFreshColumnsAfterDataTableUpload,
} from '../utils/mocks';
import * as storeUtils from '../utils/store-utils';
import {
  useFreshDataActions,
  useConfigOptions,
  useStandardizedVariables,
  useStandardizedTerms,
  useStandardizedFormats,
  useConfig,
  useColumns,
  useUploadedDataTableFileName,
  useUploadedDataDictionary,
} from './FreshNewStore';

const mockedFetchAvailableConfigs = vi.spyOn(storeUtils, 'fetchAvailableConfigs');
const mockedFetchConfig = vi.spyOn(storeUtils, 'fetchConfig');
const mockedReadFile = vi.spyOn(storeUtils, 'readFile');
const mockedParseTsvContent = vi.spyOn(storeUtils, 'parseTsvContent');

describe('appFetchesConfigOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should fetch available configs and update configOptions state on success', async () => {
    mockedFetchAvailableConfigs.mockResolvedValueOnce(mockAvailableConfigOptions);

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      configOptions: useConfigOptions(),
    }));

    await act(async () => {
      await result.current.actions.appFetchesConfigOptions();
    });

    expect(mockedFetchAvailableConfigs).toHaveBeenCalledOnce();
    expect(result.current.configOptions).toEqual(mockAvailableConfigOptions);
  });

  it('should set configOptions to empty array when fetch fails', async () => {
    mockedFetchAvailableConfigs.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      configOptions: useConfigOptions(),
    }));

    await act(async () => {
      await result.current.actions.appFetchesConfigOptions();
    });

    expect(mockedFetchAvailableConfigs).toHaveBeenCalledOnce();
    expect(result.current.configOptions).toEqual([]);
  });
});

describe('userSelectsConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should update all store states on success', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      config: useConfig(),
      standardizedVariables: useStandardizedVariables(),
      standardizedTerms: useStandardizedTerms(),
      standardizedFormats: useStandardizedFormats(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    expect(mockedFetchConfig).toHaveBeenCalledWith('Neurobagel');
    expect(result.current.config).toBe('Neurobagel');
    expect(result.current.standardizedVariables).toEqual(mockFreshStandardizedVariables);
    expect(result.current.standardizedTerms).toEqual(mockFreshStandardizedTerms);
    expect(result.current.standardizedFormats).toEqual(mockFreshStandardizedFormats);
  });

  it('should correctly map standardized variables with all properties', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedVariables: useStandardizedVariables(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    const ageVariable = result.current.standardizedVariables['nb:Age'];
    expect(ageVariable).toBeDefined();
    expect(ageVariable.id).toBe('nb:Age');
    expect(ageVariable.name).toBe('Age');
    expect(ageVariable.variable_type).toBe('Continuous');
    expect(ageVariable.description).toBe('The age of the participant.');
    expect(ageVariable.required).toBe(false);
  });

  it('should correctly map terms from multiple vocabularies', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedTerms: useStandardizedTerms(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    // Check sex terms
    const maleTerm = result.current.standardizedTerms['snomed:248153007'];
    expect(maleTerm).toBeDefined();
    expect(maleTerm.id).toBe('snomed:248153007');
    expect(maleTerm.label).toBe('Male');
    expect(maleTerm.standardizedVariableId).toBe('nb:Sex');

    // Check diagnosis terms
    const adhdTerm = result.current.standardizedTerms['snomed:406506008'];
    expect(adhdTerm).toBeDefined();
    expect(adhdTerm.label).toBe('Attention deficit hyperactivity disorder');
    expect(adhdTerm.standardizedVariableId).toBe('nb:Diagnosis');

    // Check assessment terms
    const assessmentTerm = result.current.standardizedTerms['snomed:1303696008'];
    expect(assessmentTerm).toBeDefined();
    expect(assessmentTerm.label).toBe('Robson Ten Group Classification System');
    expect(assessmentTerm.standardizedVariableId).toBe('nb:Assessment');
  });

  it('should correctly map formats with proper identifiers', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedFormats: useStandardizedFormats(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    const floatFormat = result.current.standardizedFormats['nb:FromFloat'];
    expect(floatFormat).toBeDefined();
    expect(floatFormat.identifier).toBe('nb:FromFloat');
    expect(floatFormat.label).toBe('float');
    expect(floatFormat.standardizedVariableId).toBe('nb:Age');
    expect(floatFormat.examples).toEqual(['31.5']);

    const iso8601Format = result.current.standardizedFormats['nb:FromISO8601'];
    expect(iso8601Format).toBeDefined();
    expect(iso8601Format.identifier).toBe('nb:FromISO8601');
    expect(iso8601Format.label).toBe('iso8601');
    expect(iso8601Format.examples).toEqual(['31Y6M']);
  });
});

describe('userUploadsDataTableFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read, parse, and populate columns state with uploaded TSV file', async () => {
    const mockFile = new File([mockTsvRaw], 'mock.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age', 'sex', 'group_dx', 'group', 'iq'],
      data: [
        ['sub-718211', '28.4', 'M', 'ADHD', 'HC', '80'],
        ['sub-718213', '24.6', 'F', 'ADHD', 'HC', '90'],
        ['sub-718216', '43.6', 'M', 'PD', 'HC', '100'],
        ['sub-718217', '28.4', 'F', 'PD', 'HC', '110'],
        ['sub-718218', '72.1', 'M', 'PD', 'HC', '65'],
        ['sub-718219', '56.2', 'M', 'PD', 'N/A', '87'],
        ['sub-718220', '23', 'M', 'PD', 'HC', '94'],
        ['sub-718221', '22', 'F', 'PD', 'HC', '90'],
        ['sub-718222', '21', 'M', 'PD', 'Patient', '81'],
        ['sub-718223', '45', 'F', 'PD', 'HC', '66'],
        ['sub-718224', '34', 'M', 'ADHD', 'HC', '67'],
        ['sub-718225', '65', 'N/A', 'PD', 'HC', '83'],
      ],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      fileName: useUploadedDataTableFileName(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockFile);
    });

    expect(mockedReadFile).toHaveBeenCalledWith(mockFile);
    expect(mockedParseTsvContent).toHaveBeenCalledWith(mockTsvRaw);
    expect(result.current.columns).toEqual(mockFreshColumnsAfterDataTableUpload);
    expect(result.current.fileName).toBe('mock.tsv');
  });

  it('should handle empty values in columns correctly', async () => {
    const tsvWithEmptyValues = `col1\tcol2\tcol3
value1\t\tvalue3
value4\tvalue5\t
\tvalue8\tvalue9`;

    const mockFile = new File([tsvWithEmptyValues], 'data-with-empty.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(tsvWithEmptyValues);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['col1', 'col2', 'col3'],
      data: [
        ['value1', '', 'value3'],
        ['value4', 'value5', ''],
        ['', 'value8', 'value9'],
      ],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockFile);
    });

    expect(result.current.columns['0'].allValues).toEqual(['value1', 'value4', '']);
    expect(result.current.columns['1'].allValues).toEqual(['', 'value5', 'value8']);
    expect(result.current.columns['2'].allValues).toEqual(['value3', '', 'value9']);
  });

  it('should use column index as id and header as name', async () => {
    const mockFile = new File([mockTsvRaw], 'test.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age', 'sex', 'group_dx', 'group', 'iq'],
      data: [['sub-718211', '28.4', 'M', 'ADHD', 'HC', '80']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockFile);
    });

    expect(result.current.columns['0'].id).toBe('0');
    expect(result.current.columns['0'].name).toBe('participant_id');
    expect(result.current.columns['1'].id).toBe('1');
    expect(result.current.columns['1'].name).toBe('age');
    expect(result.current.columns['2'].id).toBe('2');
    expect(result.current.columns['2'].name).toBe('sex');
    expect(result.current.columns['3'].id).toBe('3');
    expect(result.current.columns['3'].name).toBe('group_dx');
    expect(result.current.columns['4'].id).toBe('4');
    expect(result.current.columns['4'].name).toBe('group');
    expect(result.current.columns['5'].id).toBe('5');
    expect(result.current.columns['5'].name).toBe('iq');
  });

  it('should reset columns and fileName to initial state when file reading fails', async () => {
    const mockFile = new File(['invalid'], 'invalid.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockRejectedValueOnce(new Error('File read error'));

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      fileName: useUploadedDataTableFileName(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockFile);
    });

    expect(mockedReadFile).toHaveBeenCalledWith(mockFile);
    expect(result.current.columns).toEqual({});
    expect(result.current.fileName).toBeNull();
  });

  it('should reset columns and fileName when parsing fails', async () => {
    const tsvContent = 'some\tcontent';
    const mockFile = new File([tsvContent], 'test.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockResolvedValueOnce(tsvContent);
    mockedParseTsvContent.mockImplementationOnce(() => {
      throw new Error('Parse error');
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      fileName: useUploadedDataTableFileName(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockFile);
    });

    expect(result.current.columns).toEqual({});
    expect(result.current.fileName).toBeNull();
  });
});

describe('userUploadsDataDictionaryFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process data dictionary file and update columns with annotations', async () => {
    // Upload data table to populate columns object in store
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age', 'sex', 'group_dx', 'group', 'iq'],
      data: [
        ['sub-718211', '28.4', 'M', 'ADHD', 'HC', '80'],
        ['sub-718213', '24.6', 'F', 'ADHD', 'HC', '90'],
      ],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      standardizedVariables: useStandardizedVariables(),
      standardizedTerms: useStandardizedTerms(),
      standardizedFormats: useStandardizedFormats(),
      uploadedDataDictionary: useUploadedDataDictionary(),
    }));

    // Upload data table first
    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    // Load config to have standardized variables, terms, and formats
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    // Upload data dictionary
    const mockDictFile = new File([mockDataDictionaryRaw], 'mock.json', {
      type: 'application/json',
    });

    mockedReadFile.mockResolvedValueOnce(mockDataDictionaryRaw);

    await act(async () => {
      await result.current.actions.userUploadsDataDictionaryFile(mockDictFile);
    });

    expect(mockedReadFile).toHaveBeenCalledWith(mockDictFile);

    // Check columns were updated with data dictionary information
    const { columns } = result.current;

    expect(columns['0'].description).toBe('A participant ID');
    expect(columns['0'].standardizedVariable).toBe('nb:ParticipantID');
    expect(columns['0'].dataType).toBeUndefined(); // Identifier type doesn't map to DataType

    expect(columns['1'].description).toBe('Age of the participant');
    expect(columns['1'].standardizedVariable).toBe('nb:Age');
    expect(columns['1'].dataType).toBe('Continuous');
    expect(columns['1'].format).toBe('nb:FromFloat');

    expect(columns['2'].description).toBe('Sex of the participant');
    expect(columns['2'].standardizedVariable).toBe('nb:Sex');
    expect(columns['2'].dataType).toBe('Categorical');
    expect(columns['2'].levels).toBeDefined();
    expect(columns['2'].levels?.M.description).toBe('Male');
    expect(columns['2'].levels?.M.standardizedTerm).toBe('snomed:248153007');
    expect(columns['2'].levels?.F.description).toBe('Female');
    expect(columns['2'].levels?.F.standardizedTerm).toBe('snomed:248152002');
    expect(columns['2'].missingValues).toEqual(['N/A']);

    expect(columns['3'].description).toBe('Diagnosis of the participant');
    expect(columns['3'].standardizedVariable).toBe('nb:Diagnosis');
    expect(columns['3'].dataType).toBe('Categorical');
    expect(columns['3'].levels).toBeDefined();
    expect(columns['3'].levels?.ADHD.description).toBe('Attention deficit hyperactivity disorder');
    expect(columns['3'].levels?.ADHD.standardizedTerm).toBe('snomed:406506008');

    expect(columns['5'].description).toBe('iq test score of the participant');
    expect(columns['5'].standardizedVariable).toBe('nb:Assessment');
    expect(columns['5'].isPartOf).toBe('snomed:273712001');

    expect(result.current.uploadedDataDictionary.fileName).toBe('mock.json');
    expect(result.current.uploadedDataDictionary.dataDictionary).toBeDefined();
  });

  it('should handle data dictionary upload when columns do not match', async () => {
    // Upload data table with different columns
    const tsvContent = 'col1\tcol2\tcol3\nval1\tval2\tval3';
    const mockTsvFile = new File([tsvContent], 'test.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(tsvContent);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['col1', 'col2', 'col3'],
      data: [['val1', 'val2', 'val3']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    // Load config
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    // Upload data dictionary with non-matching columns
    const mockDictFile = new File([mockDataDictionaryRaw], 'mock.json', {
      type: 'application/json',
    });

    mockedReadFile.mockResolvedValueOnce(mockDataDictionaryRaw);

    await act(async () => {
      await result.current.actions.userUploadsDataDictionaryFile(mockDictFile);
    });

    // Columns should remain unchanged since names don't match
    expect(result.current.columns['0'].description).toBeUndefined();
    expect(result.current.columns['0'].standardizedVariable).toBeUndefined();
  });

  it('should reset uploadedDataDictionary when file reading fails', async () => {
    const mockDictFile = new File(['invalid'], 'invalid.json', {
      type: 'application/json',
    });

    mockedReadFile.mockRejectedValueOnce(new Error('File read error'));

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      uploadedDataDictionary: useUploadedDataDictionary(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataDictionaryFile(mockDictFile);
    });

    expect(result.current.uploadedDataDictionary.fileName).toBe('');
    expect(result.current.uploadedDataDictionary.dataDictionary).toEqual({});
  });

  it('should reset uploadedDataDictionary when JSON parsing fails', async () => {
    const invalidJson = '{ invalid json }';
    const mockDictFile = new File([invalidJson], 'invalid.json', {
      type: 'application/json',
    });

    mockedReadFile.mockResolvedValueOnce(invalidJson);

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      uploadedDataDictionary: useUploadedDataDictionary(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataDictionaryFile(mockDictFile);
    });

    expect(result.current.uploadedDataDictionary.fileName).toBe('');
    expect(result.current.uploadedDataDictionary.dataDictionary).toEqual({});
  });
});

describe('userUpdatesColumnDescription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update the description of a specific column', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age', 'sex'],
      data: [['sub-001', '25', 'M']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDescription('0', 'Updated participant identifier');
    });

    expect(result.current.columns['0'].description).toBe('Updated participant identifier');
    expect(result.current.columns['1'].description).toBeUndefined();
    expect(result.current.columns['2'].description).toBeUndefined();
  });

  it('should set description to null when description is cleared', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age'],
      data: [['sub-001', '25']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    // Set initial description
    act(() => {
      result.current.actions.userUpdatesColumnDescription('0', 'Initial description');
    });

    expect(result.current.columns['0'].description).toBe('Initial description');

    // Clear the description by setting it to null
    act(() => {
      result.current.actions.userUpdatesColumnDescription('0', null);
    });

    expect(result.current.columns['0'].description).toBeNull();
  });
});

describe('userUpdatesColumnDataType', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set dataType to categorical and initialize levels from column values', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['category'],
      data: [['A'], ['B'], ['A'], ['C'], ['B']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].dataType).toBe('Categorical');
    expect(result.current.columns['0'].levels).toBeDefined();
    expect(Object.keys(result.current.columns['0'].levels!)).toEqual(['A', 'B', 'C']);
    expect(result.current.columns['0'].levels!.A).toEqual({
      description: '',
      standardizedTerm: '',
    });
    expect(result.current.columns['0'].units).toBeUndefined();
  });

  it('should preserve existing levels when switching to categorical', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['category'],
      data: [['A'], ['B'], ['C']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].levels).toBeDefined();

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.continuous);
    });

    expect(result.current.columns['0'].levels).toBeUndefined();

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].levels).toBeDefined();
    expect(result.current.columns['0'].levels!.A.description).toBe('');
  });

  it('should set dataType to continuous and initialize units', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['age'],
      data: [['25'], ['30'], ['35']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.continuous);
    });

    expect(result.current.columns['0'].dataType).toBe(DataType.continuous);
    expect(result.current.columns['0'].units).toBe('');
    expect(result.current.columns['0'].levels).toBeUndefined();
  });

  it('should remove levels when switching from categorical to continuous', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['column'],
      data: [['A'], ['B'], ['C']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].levels).toBeDefined();

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.continuous);
    });

    expect(result.current.columns['0'].dataType).toBe(DataType.continuous);
    expect(result.current.columns['0'].levels).toBeUndefined();
    expect(result.current.columns['0'].units).toBe('');
  });

  it('should remove units when switching from continuous to categorical', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['column'],
      data: [['25'], ['30'], ['35']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.continuous);
    });

    expect(result.current.columns['0'].units).toBe('');

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].dataType).toBe(DataType.categorical);
    expect(result.current.columns['0'].units).toBeUndefined();
    expect(result.current.columns['0'].levels).toBeDefined();
  });

  it('should clear dataType, levels, and units when dataType is set to null', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['column'],
      data: [['A'], ['B']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    // Set to categorical first
    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].dataType).toBe(DataType.categorical);
    expect(result.current.columns['0'].levels).toBeDefined();

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', null);
    });

    expect(result.current.columns['0'].dataType).toBeNull();
    expect(result.current.columns['0'].levels).toBeUndefined();
    expect(result.current.columns['0'].units).toBeUndefined();
  });

  it('should handle empty values in categorical levels', async () => {
    const tsvWithEmptyValues = `col1
A

B`;

    const mockTsvFile = new File([tsvWithEmptyValues], 'data-with-empty.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(tsvWithEmptyValues);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['col1'],
      data: [['A'], [''], ['B']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].dataType).toBe(DataType.categorical);
    expect(result.current.columns['0'].levels).toBeDefined();
    expect(Object.keys(result.current.columns['0'].levels!)).toContain('');
    expect(result.current.columns['0'].levels!['']).toEqual({
      description: '',
      standardizedTerm: '',
    });
  });
});

describe('userUpdatesColumnStandardizedVariable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set standardized variable and apply categorical data type', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['sex'],
      data: [['M'], ['F'], ['M']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      standardizedVariables: useStandardizedVariables(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:Sex');
    });

    expect(result.current.columns['0'].standardizedVariable).toBe('nb:Sex');
    expect(result.current.columns['0'].dataType).toBe(DataType.categorical);
    expect(result.current.columns['0'].levels).toBeDefined();
    expect(Object.keys(result.current.columns['0'].levels!)).toEqual(['M', 'F']);
  });

  it('should set standardized variable and apply continuous data type', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['age'],
      data: [['25'], ['30'], ['35']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:Age');
    });

    expect(result.current.columns['0'].standardizedVariable).toBe('nb:Age');
    expect(result.current.columns['0'].dataType).toBe(DataType.continuous);
    expect(result.current.columns['0'].units).toBe('');
    expect(result.current.columns['0'].levels).toBeUndefined();
  });

  it('should initialize isPartOf when column is mapped to Collection type variables', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['assessment'],
      data: [['100'], ['110'], ['120']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:Assessment');
    });

    expect(result.current.columns['0'].standardizedVariable).toBe('nb:Assessment');
    expect(result.current.columns['0'].isPartOf).toBe('');
  });

  it('should remove isPartOf when changing from multi-column measure to a non-multi-column measure variable', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['column'],
      data: [['100'], ['110'], ['120']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:Assessment');
    });

    expect(result.current.columns['0'].isPartOf).toBe('');

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:Age');
    });

    expect(result.current.columns['0'].standardizedVariable).toBe('nb:Age');
    expect(result.current.columns['0'].isPartOf).toBeUndefined();
  });

  it('should set standardized variable foreign key to null when column is unmapped from all standardized variables', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['column'],
      data: [['M'], ['F']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:Sex');
    });

    expect(result.current.columns['0'].standardizedVariable).toBe('nb:Sex');

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', null);
    });

    expect(result.current.columns['0'].standardizedVariable).toBeNull();
  });

  it('should handle identifier variable type without setting dataType', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id'],
      data: [['sub-001'], ['sub-002'], ['sub-003']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:ParticipantID');
    });

    expect(result.current.columns['0'].standardizedVariable).toBe('nb:ParticipantID');
    expect(result.current.columns['0'].dataType).toBeNull();
    expect(result.current.columns['0'].levels).toBeUndefined();
    expect(result.current.columns['0'].units).toBeUndefined();
  });
});

describe('userUpdatesColumnToCollectionMapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const prepareMultiColumnAssessment = async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['assessment'],
      data: [['100'], ['110'], ['120']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    act(() => {
      result.current.actions.userUpdatesColumnStandardizedVariable('0', 'nb:Assessment');
    });

    return result;
  };

  it('should set isPartOf when provided a term identifier', async () => {
    const result = await prepareMultiColumnAssessment();

    act(() => {
      result.current.actions.userUpdatesColumnToCollectionMapping('0', 'snomed:1303696008');
    });

    expect(result.current.columns['0'].isPartOf).toBe('snomed:1303696008');
  });

  it('should delete isPartOf when null is provided', async () => {
    const result = await prepareMultiColumnAssessment();

    act(() => {
      result.current.actions.userUpdatesColumnToCollectionMapping('0', 'snomed:1303696008');
    });

    expect(result.current.columns['0'].isPartOf).toBe('snomed:1303696008');

    act(() => {
      result.current.actions.userUpdatesColumnToCollectionMapping('0', null);
    });

    expect(result.current.columns['0'].isPartOf).toBeUndefined();
  });
});

describe('userCreatesCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const initializeTerms = async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedTerms: useStandardizedTerms(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    return result;
  };

  it('should set isCollection to true for the provided term', async () => {
    const result = await initializeTerms();

    expect(result.current.standardizedTerms['snomed:1303696008'].isCollection).toBe(false);

    act(() => {
      result.current.actions.userCreatesCollection('snomed:1303696008');
    });

    expect(result.current.standardizedTerms['snomed:1303696008'].isCollection).toBe(true);
  });
});

describe('userDeletesCollection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const initializeTerms = async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedTerms: useStandardizedTerms(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    return result;
  };

  it('should set isCollection to false when toggled off and remove column mappings', async () => {
    const result = await initializeTerms();

    act(() => {
      result.current.actions.userCreatesCollection('snomed:1303696008');
    });

    expect(result.current.standardizedTerms['snomed:1303696008'].isCollection).toBe(true);

    act(() => {
      result.current.actions.userUpdatesColumnToCollectionMapping('0', 'snomed:1303696008');
    });

    act(() => {
      result.current.actions.userDeletesCollection('snomed:1303696008');
    });

    expect(result.current.standardizedTerms['snomed:1303696008'].isCollection).toBe(false);
    expect(result.current.columns['0'].isPartOf).toBeUndefined();
  });
});

describe('userUpdatesColumnLevelDescription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update level descriptions for a column', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['category'],
      data: [['A'], ['B'], ['C']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
      result.current.actions.userUpdatesValueDescription('0', 'A', 'Group A');
    });

    expect(result.current.columns['0'].levels?.A.description).toBe('Group A');
    expect(result.current.columns['0'].levels?.B.description).toBe('');
  });

  it('should ignore updates when the level entry is absent', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['category'],
      data: [['A'], ['B'], ['C']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    expect(result.current.columns['0'].levels).toBeDefined();

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.continuous);
    });

    expect(result.current.columns['0'].levels).toBeUndefined();

    act(() => {
      result.current.actions.userUpdatesValueDescription('0', 'C', 'Category C');
    });

    expect(result.current.columns['0'].levels).toBeUndefined();
  });
});

describe('userUpdatesColumnLevelTerm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupCategoricalColumn = async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['category'],
      data: [['A'], ['B'], ['C']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    return result;
  };

  it('should assign standardized terms to a level when provided', async () => {
    const result = await setupCategoricalColumn();

    act(() => {
      result.current.actions.userUpdatesValueStandardizedTerm('0', 'A', 'nb:Term1');
    });

    expect(result.current.columns['0'].levels?.A.standardizedTerm).toBe('nb:Term1');
  });

  it('should clear standardized terms when null is provided', async () => {
    const result = await setupCategoricalColumn();

    act(() => {
      result.current.actions.userUpdatesValueStandardizedTerm('0', 'B', 'nb:Term2');
    });

    expect(result.current.columns['0'].levels?.B.standardizedTerm).toBe('nb:Term2');

    act(() => {
      result.current.actions.userUpdatesValueStandardizedTerm('0', 'B', null);
    });

    expect(result.current.columns['0'].levels?.B.standardizedTerm).toBe('');
  });
});

describe('userUpdatesColumnUnits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set units for a column', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['age'],
      data: [['25'], ['30'], ['35']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnUnits('0', 'years');
    });

    expect(result.current.columns['0'].units).toBe('years');
  });

  it('should overwrite existing units', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['age'],
      data: [['25'], ['30'], ['35']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnUnits('0', 'years');
    });

    expect(result.current.columns['0'].units).toBe('years');

    act(() => {
      result.current.actions.userUpdatesColumnUnits('0', 'months');
    });

    expect(result.current.columns['0'].units).toBe('months');
  });
});

describe('userUpdatesColumnMissingValues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupCategoricalColumn = async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['category'],
      data: [['A'], ['B'], ['C']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.categorical);
    });

    return result;
  };

  it('should add missing values and remove them from levels for categorical columns', async () => {
    const result = await setupCategoricalColumn();

    act(() => {
      result.current.actions.userUpdatesColumnMissingValues('0', 'A', true);
    });

    expect(result.current.columns['0'].missingValues).toEqual(['A']);
    expect(result.current.columns['0'].levels?.A).toBeUndefined();

    act(() => {
      result.current.actions.userUpdatesColumnMissingValues('0', 'B', true);
    });

    expect(result.current.columns['0'].missingValues).toEqual(['A', 'B']);
    expect(result.current.columns['0'].levels?.B).toBeUndefined();
  });

  it('should remove missing values and reintroduce levels when toggled off', async () => {
    const result = await setupCategoricalColumn();

    act(() => {
      result.current.actions.userUpdatesColumnMissingValues('0', 'A', true);
      result.current.actions.userUpdatesColumnMissingValues('0', 'B', true);
    });

    expect(result.current.columns['0'].missingValues).toEqual(['A', 'B']);

    act(() => {
      result.current.actions.userUpdatesColumnMissingValues('0', 'A', false);
    });

    expect(result.current.columns['0'].missingValues).toEqual(['B']);
    expect(result.current.columns['0'].levels?.A).toEqual({
      description: '',
      standardizedTerm: '',
    });

    act(() => {
      result.current.actions.userUpdatesColumnMissingValues('0', 'B', false);
    });

    expect(result.current.columns['0'].missingValues).toEqual([]);
    expect(result.current.columns['0'].levels?.B).toEqual({
      description: '',
      standardizedTerm: '',
    });
  });

  it('should handle non-categorical columns without touching levels', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['value'],
      data: [['1'], ['2'], ['3']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnDataType('0', DataType.continuous);
      result.current.actions.userUpdatesColumnMissingValues('0', 'N/A', true);
    });

    expect(result.current.columns['0'].missingValues).toEqual(['N/A']);
    expect(result.current.columns['0'].levels).toBeUndefined();
  });
});

describe('userUpdatesColumnFormat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set and update the format for a column', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['age'],
      data: [['25'], ['30'], ['35']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnFormat('0', 'nb:FromFloat');
    });

    expect(result.current.columns['0'].format).toBe('nb:FromFloat');

    act(() => {
      result.current.actions.userUpdatesColumnFormat('0', 'nb:FromISO8601');
    });

    expect(result.current.columns['0'].format).toBe('nb:FromISO8601');
  });

  it('should clear the format when null is passed', async () => {
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['age'],
      data: [['25'], ['30'], ['35']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    act(() => {
      result.current.actions.userUpdatesColumnFormat('0', 'nb:FromFloat');
    });

    expect(result.current.columns['0'].format).toBe('nb:FromFloat');

    act(() => {
      result.current.actions.userUpdatesColumnFormat('0', null);
    });

    expect(result.current.columns['0'].format).toBeUndefined();
  });
});

describe('reset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reset columns and uploaded files while preserving config state', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockFreshTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      uploadedDataTableFileName: useUploadedDataTableFileName(),
      uploadedDataDictionary: useUploadedDataDictionary(),
      config: useConfig(),
      standardizedVariables: useStandardizedVariables(),
      standardizedTerms: useStandardizedTerms(),
      standardizedFormats: useStandardizedFormats(),
    }));

    // Load config
    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    // Upload data table
    const mockTsvFile = new File([mockTsvRaw], 'mock.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age'],
      data: [['sub-001', '25']],
    });

    await act(async () => {
      await result.current.actions.userUploadsDataTableFile(mockTsvFile);
    });

    // Upload data dictionary
    const mockDictFile = new File([mockDataDictionaryRaw], 'mock.json', {
      type: 'application/json',
    });

    mockedReadFile.mockResolvedValueOnce(mockDataDictionaryRaw);

    await act(async () => {
      await result.current.actions.userUploadsDataDictionaryFile(mockDictFile);
    });

    // Verify columns has data
    expect(result.current.columns).not.toEqual({});
    expect(result.current.uploadedDataTableFileName).toBe('mock.tsv');
    expect(result.current.uploadedDataDictionary.fileName).toBe('mock.json');
    expect(result.current.uploadedDataDictionary.dataDictionary).toBeDefined();
    expect(result.current.config).toBe('Neurobagel');

    expect(result.current.columns['0'].id).toBe('0');
    expect(result.current.columns['0'].name).toBe('participant_id');
    expect(result.current.columns['0'].allValues).toEqual(['sub-001']);
    expect(result.current.columns['0'].description).toBe('A participant ID');
    expect(result.current.columns['0'].standardizedVariable).toBe('nb:ParticipantID');
    expect(result.current.columns['1'].id).toBe('1');
    expect(result.current.columns['1'].name).toBe('age');
    expect(result.current.columns['1'].allValues).toEqual(['25']);
    expect(result.current.columns['1'].description).toBe('Age of the participant');
    expect(result.current.columns['1'].standardizedVariable).toBe('nb:Age');
    expect(result.current.columns['1'].dataType).toBe('Continuous');
    expect(result.current.columns['1'].format).toBe('nb:FromFloat');

    // Reset
    act(() => {
      result.current.actions.reset();
    });

    // Verify column data is cleared
    expect(result.current.columns).toEqual({});
    expect(result.current.uploadedDataTableFileName).toBeNull();
    expect(result.current.uploadedDataDictionary.fileName).toBe('');
    expect(result.current.uploadedDataDictionary.dataDictionary).toEqual({});

    // Verify specific column values are cleared
    expect(result.current.columns['0']).toBeUndefined();
    expect(result.current.columns['1']).toBeUndefined();

    // Verify config state is preserved
    expect(result.current.config).toBe('Neurobagel');
    expect(result.current.standardizedVariables).toEqual(mockFreshStandardizedVariables);
    expect(result.current.standardizedTerms).toEqual(mockFreshStandardizedTerms);
    expect(result.current.standardizedFormats).toEqual(mockFreshStandardizedFormats);
  });
});
