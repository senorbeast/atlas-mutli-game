import { StateCreator } from 'zustand'
import { MyState } from './store'

export interface ViewSlice {
  darkMode: boolean
  toggleMode: () => void
}

export const createViewSlice: StateCreator<
  MyState,
  [['zustand/immer', never]],
  [],
  ViewSlice
> = (set) => ({
  darkMode: true,
  toggleMode: () =>
    set((state) => ({ darkMode: state.darkMode ? false : true })),
})
