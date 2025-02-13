import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useStore from './store';

describe('store actions', () => {
  it('should set currentView', () => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setCurrentView('upload');
    });
    expect(result.current.currentView).toBe('upload');
  });
});
