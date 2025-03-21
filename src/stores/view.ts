import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { steps } from '../utils/constants';
import { View } from '../utils/types';

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
  const currentStepIndex = steps.findIndex((step) => step.view === currentView);

  if (currentStepIndex === -1) {
    return {
      backView: undefined,
      nextView: undefined,
      backLabel: undefined,
      nextLabel: undefined,
      className: '',
    };
  }

  const backStep =
    currentStepIndex === 0 ? { view: View.Landing, label: 'Landing' } : steps[currentStepIndex - 1];
  const nextStep = steps[currentStepIndex + 1];

  return {
    backView: backStep?.view,
    nextView: nextStep?.view,
    backLabel: backStep ? `Back to ${backStep.label}` : undefined,
    nextLabel: nextStep ? `Next: ${nextStep.label}` : undefined,
    className: 'p-4',
  };
};

export default useViewStore;
