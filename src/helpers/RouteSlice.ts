import { StateCreator } from 'zustand'
import { MyState } from './store'

export interface RouteSlice {
  router: string[] | null
  setRoute: (newRoute: string) => void
  dom: any
}

export const createRouteSlice: StateCreator<
  MyState,
  [['zustand/immer', never]],
  [],
  RouteSlice
> = (set) => ({
  router: null,
  setRoute: (newRoute) =>
    set((state) => ({ router: state.router.push(newRoute) })),
  dom: null,
})
