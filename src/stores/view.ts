import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ViewStore = {
  currentView: string;
  setCurrentView: (view: string) => void;
};

const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      currentView: 'landing',
      setCurrentView: (view: string) => set({ currentView: view }),
    }),
    {
      name: 'view-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useViewStore;
