import { immer } from 'zustand/middleware/immer'
import create, { StateCreator, UseBoundStore } from 'zustand'
// import { shallow } from 'zustand/shallow'

interface Routes {
  router: string[] | null
  setRoute: (newRoute: string) => void
  dom: any
}

const createRouteSlice: StateCreator<
  Routes,
  [['zustand/immer', never]],
  [],
  Routes
> = (set) => ({
  router: null,
  setRoute: (newRoute) =>
    set((state) => ({ router: state.router.push(newRoute) })),
  dom: null,
})

interface RoomSlice {
  rooms: number[]
  addRoom: (newRoom: number) => void
}
const createRoomSlice: StateCreator<
  RoomSlice & GameSlice & ViewSlice,
  [['zustand/immer', never]],
  [],
  RoomSlice
> = (set) => ({
  rooms: [0],
  addRoom: (newRoom) =>
    set((state) => ({ rooms: state.rooms.concat(newRoom) })),
})

interface GameSlice {
  id: number
  name: string
  players: number
  addPlayer: () => void
}
const createGameSlice: StateCreator<
  RoomSlice & GameSlice & ViewSlice,
  [['zustand/immer', never]],
  [],
  GameSlice
> = (set) => ({
  id: 0,
  name: 'Game',
  players: 4,
  addPlayer: () => set((state) => ({ players: state.players + 1 })),
})

interface ViewSlice {
  darkMode: boolean
  toggleMode: () => void
}

const createViewSlice: StateCreator<
  RoomSlice & GameSlice & ViewSlice,
  [['zustand/immer', never]],
  [],
  ViewSlice
> = (set) => ({
  darkMode: true,
  toggleMode: () =>
    set((state) => ({ darkMode: state.darkMode ? false : true })),
})

const useStoreImpl = create<Routes & RoomSlice & GameSlice & ViewSlice>()(
  immer((...a) => ({
    ...createRoomSlice(...a),
    ...createGameSlice(...a),
    ...createViewSlice(...a),
    ...createRouteSlice(...a),
  }))
)

// const useStore = (sel: ) => useStoreImpl(sel, shallow)
// Object.assign(useStore, useStoreImpl)
const { getState, setState } = useStoreImpl
export { getState, setState }
export default useStoreImpl
