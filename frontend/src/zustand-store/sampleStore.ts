// this is a sample zustand store for managing a simple counter state

import {create} from "zustand";

interface SampleState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useSampleStore = create<SampleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({count: state.count + 1})),
  decrement: () => set((state) => ({count: state.count - 1})),
  reset: () => set({count: 0}),
}));

export default useSampleStore;

// Usage example:
// const { count, increment, decrement, reset } = useSampleStore();
