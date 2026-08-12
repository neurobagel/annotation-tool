import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type LocalStore = {
  hasSeenColumnAnnotationTour: boolean;
  setHasSeenColumnAnnotationTour: (seen: boolean) => void;
};

const localStoreCreator = persist<LocalStore>(
  (set) => ({
    hasSeenColumnAnnotationTour: false,
    setHasSeenColumnAnnotationTour: (seen: boolean) => set({ hasSeenColumnAnnotationTour: seen }),
  }),
  {
    name: 'local',
    storage: createJSONStorage(() => localStorage),
  }
);

const useLocalStore = create<LocalStore>()(devtools(localStoreCreator));

export default useLocalStore;
