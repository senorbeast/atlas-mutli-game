import { StateCreator } from 'zustand'
import { MyState } from './store'

export interface GameSlice {
  id: number
  name: string
  players: number
  addPlayer: () => void
}
export const createGameSlice: StateCreator<
  MyState,
  [['zustand/immer', never]],
  [],
  GameSlice
> = (set) => ({
  id: 0,
  name: 'Game',
  players: 4,
  addPlayer: () => set((state) => ({ players: state.players + 1 })),
})
