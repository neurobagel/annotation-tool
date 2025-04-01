import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { steps } from '../utils/constants';
import { View } from '../utils/types';
import useDataStore from './data';

type NavigationProps = {
  backView: View | undefined;
  nextView: View | undefined;
  backLabel?: string;
  nextLabel?: string;
  className: string;
};

type ViewStore = {
  currentView: View;
  setCurrentView: (view: View) => void;
};

const useViewStore = create<ViewStore>()(
  devtools((set) => ({
    currentView: 'landing',
    setCurrentView: (view: View) => set({ currentView: view }),
  }))
);

export const getNavigationProps = (currentView: View): NavigationProps => {
  const hasMultiColumnMeasures = useDataStore.getState().hasMultiColumnMeasures();

  // Define the complete navigation flow
  const navigationFlow = [
    View.Landing,
    View.Upload,
    View.ColumnAnnotation,
    ...(hasMultiColumnMeasures ? [View.MultiColumnMeasures] : []),
    View.ValueAnnotation,
    View.Download,
  ];

  const currentIndex = navigationFlow.indexOf(currentView);

  // If we're on MultiColumnMeasures but shouldn't be, redirect
  if (currentView === View.ColumnAnnotation && hasMultiColumnMeasures) {
    return {
      backView: View.Upload,
      nextView: View.MultiColumnMeasures,
      backLabel: 'Back to Upload',
      nextLabel: 'Next: Multi-Column Measures',
      className: 'p-4',
    };
  }

  if (currentView === View.ValueAnnotation && hasMultiColumnMeasures) {
    return {
      backView: View.MultiColumnMeasures,
      nextView: View.Download,
      backLabel: 'Back to Multi-Column Measures',
      nextLabel: 'Next: Download',
      className: 'p-4',
    };
  }

  if (currentView === View.MultiColumnMeasures && !hasMultiColumnMeasures) {
    return {
      backView: View.ColumnAnnotation,
      nextView: View.ValueAnnotation,
      backLabel: 'Back to Column Annotation',
      nextLabel: 'Next: Value Annotation',
      className: 'p-4',
    };
  }

  if (currentIndex === -1) {
    return {
      backView: undefined,
      nextView: undefined,
      backLabel: undefined,
      nextLabel: undefined,
      className: '',
    };
  }

  const backView = currentIndex > 0 ? navigationFlow[currentIndex - 1] : undefined;
  const nextView =
    currentIndex < navigationFlow.length - 1 ? navigationFlow[currentIndex + 1] : undefined;

  return {
    backView,
    nextView,
    backLabel: backView ? `Back to ${steps.find((s) => s.view === backView)?.label}` : undefined,
    nextLabel: nextView ? `Next: ${steps.find((s) => s.view === nextView)?.label}` : undefined,
    className: 'p-4',
  };
};

export default useViewStore;
