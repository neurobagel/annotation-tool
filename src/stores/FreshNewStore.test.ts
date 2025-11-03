import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockAvailableConfigOptions } from '../utils/mocks';
import { fetchAvailableConfigs } from '../utils/store-utils';
import { useFreshDataActions, useConfigOptions } from './FreshNewStore';

// Mock the store-utils module
vi.mock('../utils/store-utils');
const mockedFetchAvailableConfigs = vi.mocked(fetchAvailableConfigs);

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
