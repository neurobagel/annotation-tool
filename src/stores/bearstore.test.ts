import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useBears, useBearActions, State, Actions } from './bearstore';

type TestHookResults = {
  bearsResult: { current: State['bears'] };
  actionsResult: { current: Actions };
};

describe('bearstore actions', () => {
  let result: TestHookResults;

  beforeEach(() => {
    // Reset the store state before each test
    const { result: bearsResult } = renderHook(() => useBears());
    const { result: actionsResult } = renderHook(() => useBearActions());
    act(() => {
      actionsResult.current.removeAllBears();
    });
    result = { bearsResult, actionsResult };
  });

  afterEach(() => {
    // Optionally clean up if your store has a method to reset state
  });

  it('should increase population', () => {
    act(() => {
      result.actionsResult.current.increasePopulation(1);
    });
    expect(result.bearsResult.current).toBe(1);
  });

  it('should remove all bears', () => {
    // Add some bears before removing them
    act(() => {
      result.actionsResult.current.increasePopulation(1);
      result.actionsResult.current.removeAllBears();
    });
    expect(result.bearsResult.current).toBe(0);
  });

  it('should update bears', () => {
    const newBearCount = 4;
    act(() => {
      result.actionsResult.current.updateBears(newBearCount);
    });
    expect(result.bearsResult.current).toBe(newBearCount);
  });
});
