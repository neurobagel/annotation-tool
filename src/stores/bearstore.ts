import { create } from 'zustand';

export type State = {
  bears: number;
  actions: Actions;
};

export type Actions = {
  increasePopulation: (bears: State['bears']) => void;
  removeAllBears: () => void;
  updateBears: (bears: number) => void;
};

const useBearStore = create<State>((set) => ({
  bears: 0,
  actions: {
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    updateBears: (newBears) => set({ bears: newBears }),
  },
}));

// See https://tkdodo.eu/blog/working-with-zustand for details on
// why we use this structure
export const useBears = () => useBearStore((state) => state.bears);
export const useBearActions = () => useBearStore((state) => state.actions);
