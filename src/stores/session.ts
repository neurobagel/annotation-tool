import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type SessionStore = {
  hasSeenColumnAnnotationTour: boolean;
  setHasSeenColumnAnnotationTour: (seen: boolean) => void;
};

const sessionStoreCreator = persist<SessionStore>(
  (set) => ({
    hasSeenColumnAnnotationTour: false,
    setHasSeenColumnAnnotationTour: (seen: boolean) => set({ hasSeenColumnAnnotationTour: seen }),
  }),
  {
    name: 'session',
    storage: createJSONStorage(() => sessionStorage),
  }
);

const useSessionStore = create<SessionStore>()(devtools(sessionStoreCreator));

export default useSessionStore;
