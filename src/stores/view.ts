import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { View } from '../utils/types';

type NavigationConfig = {
  backLabel?: string;
  nextLabel?: string;
  className: string;
};

type ViewStore = {
  currentView: View;
  setCurrentView: (view: View) => void;
  getNavigationViews: () => { backView: View | undefined; nextView: View | undefined };
  getNavigationConfig: () => NavigationConfig;
};

const useViewStore = create<ViewStore>()(
  persist(
    (set, get) => ({
      currentView: View.Landing,
      setCurrentView: (view: View) => set({ currentView: view }),

      // Get back and next views based on the current view
      getNavigationViews: () => {
        const { currentView } = get();
        switch (currentView) {
          case View.Landing:
            return { backView: undefined, nextView: undefined };
          case View.Upload:
            return { backView: View.Landing, nextView: View.ColumnAnnotation };
          case View.ColumnAnnotation:
            return { backView: View.Upload, nextView: View.ValueAnnotation };
          case View.ValueAnnotation:
            return { backView: View.ColumnAnnotation, nextView: View.Download };
          case View.Download:
            return { backView: View.ValueAnnotation, nextView: undefined };
          default:
            return { backView: undefined, nextView: undefined };
        }
      },

      getNavigationConfig: () => {
        const { currentView } = get();
        switch (currentView) {
          case View.Upload:
            return {
              backLabel: 'Back to Landing',
              nextLabel: 'Next: Column Annotation',
              className: 'p-4',
            };
          case View.ColumnAnnotation:
            return {
              backLabel: 'Back to Upload',
              nextLabel: 'Next: Value Annotation',
              className: 'p-4',
            };
          case View.ValueAnnotation:
            return {
              backLabel: 'Back to Column Annotation',
              nextLabel: 'Next: Download',
              className: 'p-4',
            };
          default:
            return {
              backLabel: undefined,
              nextLabel: undefined,
              className: '',
            };
        }
      },
    }),
    {
      name: 'view-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useViewStore;
