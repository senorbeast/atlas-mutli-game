import { immer } from 'zustand/middleware/immer'
import create, { StateCreator, UseBoundStore } from 'zustand'
// import { shallow } from 'zustand/shallow'

import { createRoomSlice, RoomSlice } from './RoomSlice'
import { createViewSlice, ViewSlice } from './ViewSlice'
import { createGameSlice, GameSlice } from './GameSlice'
import { createISocketContextSlice, SocketSlice } from './SocketSlice'

export type MyState = 
  RoomSlice &
  GameSlice &
  ViewSlice &
  SocketSlice

const useStoreImpl = create<MyState>()(
  immer((...a) => ({
    ...createRoomSlice(...a),
    ...createGameSlice(...a),
    ...createViewSlice(...a),
    ...createISocketContextSlice(...a),
  }))
)

// const useStore = (sel: ) => useStoreImpl(sel, shallow)
// Object.assign(useStore, useStoreImpl)
const { getState, setState } = useStoreImpl
export { getState, setState }
export default useStoreImpl
