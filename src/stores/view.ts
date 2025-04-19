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
    currentView: View.Landing,
    setCurrentView: (view: View) => set({ currentView: view }),
  }))
);

export const getNavigationProps = (currentView: View): NavigationProps => {
  const hasMultiColumnMeasures = useDataStore.getState().hasMultiColumnMeasures();

  const navigationFlow = [
    View.Landing,
    View.Upload,
    View.ColumnAnnotation,
    ...(hasMultiColumnMeasures ? [View.MultiColumnMeasures] : []),
    View.ValueAnnotation,
    View.Download,
  ];

  const currentIndex = navigationFlow.indexOf(currentView);

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

  let backLabel;
  if (backView) {
    if (backView === View.Landing) {
      backLabel = 'Back to Landing';
    } else {
      const step = steps.find((s) => s.view === backView);
      backLabel = step ? `Back to ${step.label}` : undefined;
    }
  }

  let nextLabel;
  if (nextView) {
    const step = steps.find((s) => s.view === nextView);
    nextLabel = step ? `Next: ${step.label}` : undefined;
  }

  return {
    backView,
    nextView,
    backLabel,
    nextLabel,
    className: 'p-4',
  };
};

export default useViewStore;
