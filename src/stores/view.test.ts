import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useViewStore from './view';
import { View } from '../utils/types';

describe('store actions', () => {
  it('should set currentView', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => {
      result.current.setCurrentView(View.Upload);
    });
    expect(result.current.currentView).toBe('upload');
  });
});
