import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Store = {
  currentView: string;
  setCurrentView: (view: string) => void;
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      currentView: 'landing',
      setCurrentView: (view: string) => set({ currentView: view }),
    }),
    {
      name: 'store',
      partialize: (state) => ({ currentView: state.currentView }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useStore;
