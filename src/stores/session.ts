import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type SessionStore = {
  hasSeenColumnAnnotationTour: boolean;
  setHasSeenColumnAnnotationTour: (seen: boolean) => void;
};

const useSessionStore = create<SessionStore>()(
  devtools(
    persist(
      (set) => ({
        hasSeenColumnAnnotationTour: false,
        setHasSeenColumnAnnotationTour: (seen: boolean) =>
          set({ hasSeenColumnAnnotationTour: seen }),
      }),
      {
        name: 'session',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useSessionStore;
