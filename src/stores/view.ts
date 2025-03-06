import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ViewStore = {
  currentView: string;
  setCurrentView: (view: string) => void;
};

const useViewStore = create<ViewStore>()(
  devtools((set) => ({
    currentView: 'landing',
    setCurrentView: (view: string) => set({ currentView: view }),
  }))
);

export default useViewStore;
