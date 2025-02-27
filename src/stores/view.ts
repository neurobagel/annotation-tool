import { create } from 'zustand';

type ViewStore = {
  currentView: string;
  setCurrentView: (view: string) => void;
};

const useViewStore = create<ViewStore>()((set) => ({
  currentView: 'landing',
  setCurrentView: (view: string) => set({ currentView: view }),
}));

export default useViewStore;
