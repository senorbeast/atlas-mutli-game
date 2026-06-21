import type { StateCreator } from 'zustand'
import type {
  AtlasGameState,
  ChatEvent,
  ConnectAck,
  ConnectionStatus,
  GameEvent,
  PlayerSummary,
} from '@/protocol/types'
import type { MyState } from './store'

export interface RealtimeSlice {
  connectionStatus: ConnectionStatus
  roomId: string | null
  playerId: string | null
  displayName: string | null
  realtimePlayers: PlayerSummary[]
  messages: ChatEvent[]
  unreadMessageCount: number
  isChatOpen: boolean
  playerNamesById: Record<string, string>
  gameState: AtlasGameState | null
  gameEvents: GameEvent[]
  realtimeError: string | null
  setDisplayName: (name: string | null) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setConnectAck: (ack: ConnectAck) => void
  addChatMessage: (message: ChatEvent) => void
  setChatOpen: (isOpen: boolean) => void
  resetUnreadMessages: () => void
  setGameState: (state: AtlasGameState) => void
  addGameEvent: (event: GameEvent) => void
  setRealtimeError: (message: string | null) => void
  resetRealtime: () => void
}

const initialState = {
  connectionStatus: 'idle' as ConnectionStatus,
  roomId: null,
  playerId: null,
  displayName: null,
  realtimePlayers: [],
  messages: [],
  unreadMessageCount: 0,
  isChatOpen: false,
  playerNamesById: {},
  gameState: null,
  gameEvents: [],
  realtimeError: null,
}

export const createRealtimeSlice: StateCreator<MyState, [['zustand/immer', never]], [], RealtimeSlice> = (set) => ({
  ...initialState,
  setDisplayName: (name) =>
    set((state) => {
      state.displayName = name?.trim() || null
      if (state.playerId && state.displayName) {
        state.playerNamesById[state.playerId] = state.displayName
        const self = state.realtimePlayers.find((player) => player.id === state.playerId)
        if (self) self.name = state.displayName
      }
    }),
  setConnectionStatus: (status) =>
    set((state) => {
      state.connectionStatus = status
    }),
  setConnectAck: (ack) =>
    set((state) => {
      const selfName = state.displayName ?? 'You'
      state.connectionStatus = 'connected'
      state.roomId = ack.roomId
      state.playerId = ack.playerId
      state.realtimeError = null
      state.playerNamesById[ack.playerId] = selfName
      state.realtimePlayers = [
        {
          id: ack.playerId,
          name: selfName,
          hearts: 1,
          score: 0,
          isSelf: true,
        },
      ]
    }),
  addChatMessage: (message) =>
    set((state) => {
      const senderName = message.senderName ?? state.playerNamesById[message.senderId]
      if (senderName) state.playerNamesById[message.senderId] = senderName
      state.messages.push({ ...message, senderName })
      if (!state.isChatOpen && message.senderId !== state.playerId) state.unreadMessageCount += 1
    }),
  setChatOpen: (isOpen) =>
    set((state) => {
      state.isChatOpen = isOpen
      if (isOpen) state.unreadMessageCount = 0
    }),
  resetUnreadMessages: () =>
    set((state) => {
      state.unreadMessageCount = 0
    }),
  setGameState: (gameState) =>
    set((state) => {
      state.gameState = gameState
    }),
  addGameEvent: (event) =>
    set((state) => {
      state.gameEvents.push(event)
    }),
  setRealtimeError: (message) =>
    set((state) => {
      state.realtimeError = message
      if (message) state.connectionStatus = 'error'
    }),
  resetRealtime: () =>
    set((state) => ({
      ...initialState,
      displayName: state.displayName,
      playerNamesById: state.playerId && state.displayName ? { [state.playerId]: state.displayName } : {},
    })),
})
