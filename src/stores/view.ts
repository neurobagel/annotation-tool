import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
  persist(
    (set) => ({
      currentView: View.Landing,
      setCurrentView: (view: View) => set({ currentView: view }),
    }),
    {
      name: 'view-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const getNavigationProps = (currentView: View): NavigationProps => {
  switch (currentView) {
    case View.Landing:
      return {
        backView: undefined,
        nextView: undefined,
        backLabel: undefined,
        nextLabel: undefined,
        className: '',
      };
    case View.Upload:
      return {
        backView: View.Landing,
        nextView: View.ColumnAnnotation,
        backLabel: 'Back to Landing',
        nextLabel: 'Next: Column Annotation',
        className: 'p-4',
      };
    case View.ColumnAnnotation:
      return {
        backView: View.Upload,
        nextView: View.ValueAnnotation,
        backLabel: 'Back to Upload',
        nextLabel: 'Next: Value Annotation',
        className: 'p-4',
      };
    case View.ValueAnnotation:
      return {
        backView: View.ColumnAnnotation,
        nextView: View.Download,
        backLabel: 'Back to Column Annotation',
        nextLabel: 'Next: Download',
        className: 'p-4',
      };
    case View.Download:
      return {
        backView: View.ValueAnnotation,
        nextView: undefined,
        backLabel: undefined,
        nextLabel: undefined,
        className: '',
      };
    default:
      return {
        backView: undefined,
        nextView: undefined,
        backLabel: undefined,
        nextLabel: undefined,
        className: '',
      };
  }
};

export default useViewStore;
