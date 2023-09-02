import { StateCreator } from 'zustand'
import { MyState } from './store'

export interface RoomSlice {
  rooms: number[]
  addRoom: (newRoom: number) => void
}
export const createRoomSlice: StateCreator<
  MyState,
  [['zustand/immer', never]],
  [],
  RoomSlice
> = (set) => ({
  rooms: [0],
  addRoom: (newRoom) =>
    set((state) => ({ rooms: state.rooms.concat(newRoom) })),
})
