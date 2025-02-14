import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Store = {
  dataTable: object;
  setDataTable: (data: object) => void;
  columns: object;
  initializeColumns: (data: object) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      dataTable: {},
      setDataTable: (data: object) => set({ dataTable: data }),
      columns: {},
      initializeColumns: (data: object) => set({ columns: data }),
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
