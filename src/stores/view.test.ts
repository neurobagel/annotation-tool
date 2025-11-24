import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { View } from '../../internal_types';
import useViewStore from './view';

describe('view store actions', () => {
  it('should set currentView', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => {
      result.current.setCurrentView(View.Upload);
    });
    expect(result.current.currentView).toBe('upload');
  });
});
