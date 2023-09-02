import { Socket } from 'socket.io-client'
import { StateCreator } from 'zustand'
import type { MyState } from './store'

export interface SocketSlice {
  socket?: Socket
  uid: string
  users: string[]
}

export const createISocketContextSlice: StateCreator<
  MyState,
  [['zustand/immer', never]],
  [],
  SocketSlice
> = (set) => ({
  socket: undefined,
  uid: '12',
  users: [],
})
