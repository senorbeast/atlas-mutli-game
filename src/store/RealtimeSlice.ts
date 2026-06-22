import type { StateCreator } from 'zustand'
import type {
  AcceptedCity,
  AtlasGameState,
  ChatEvent,
  ConnectAck,
  ConnectionStatus,
  GameEvent,
  PlayerSummary,
  ServerErrorEvent,
  TurnMode,
} from '@/protocol/types'
import type { RoomSnapshot } from '@/protocol/generated/other_payloads_pb'
import type { MyState } from './store'

export interface RealtimeSlice {
  connectionStatus: ConnectionStatus
  roomId: string | null
  playerId: string | null
  displayName: string | null
  turnMode: TurnMode
  currentTurnPlayerId: string | null
  currentTurnPlayerName: string | null
  realtimePlayers: PlayerSummary[]
  messages: ChatEvent[]
  hasOlderChatMessages: boolean
  nextChatCursor: string | null
  isLoadingOlderMessages: boolean
  unreadMessageCount: number
  isChatOpen: boolean
  playerNamesById: Record<string, string>
  gameState: AtlasGameState | null
  gameEvents: GameEvent[]
  serverError: ServerErrorEvent | null
  realtimeError: string | null
  setDisplayName: (name: string | null) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setConnectAck: (ack: ConnectAck) => void
  setRoomSnapshot: (snapshot: RoomSnapshot) => void
  addChatMessage: (message: ChatEvent) => void
  setChatHistoryPage: (messages: ChatEvent[], nextCursor: string | undefined, mode: 'replace' | 'prepend') => void
  setChatHistoryLoading: (isLoading: boolean) => void
  setChatOpen: (isOpen: boolean) => void
  resetUnreadMessages: () => void
  setGameState: (state: AtlasGameState) => void
  addGameEvent: (event: GameEvent) => void
  setServerError: (error: ServerErrorEvent | null) => void
  setRealtimeError: (message: string | null) => void
  resetRealtime: () => void
}

const initialState = {
  connectionStatus: 'idle' as ConnectionStatus,
  roomId: null,
  playerId: null,
  displayName: null,
  turnMode: 'strict-turns' as TurnMode,
  currentTurnPlayerId: null,
  currentTurnPlayerName: null,
  realtimePlayers: [],
  messages: [],
  hasOlderChatMessages: false,
  nextChatCursor: null,
  isLoadingOlderMessages: false,
  unreadMessageCount: 0,
  isChatOpen: false,
  playerNamesById: {},
  gameState: null,
  gameEvents: [],
  serverError: null,
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
      state.turnMode = ack.turnMode
      state.realtimeError = null
      state.playerNamesById[ack.playerId] = selfName
      if (ack.room) applyRoomSnapshot(state, ack.room, ack.playerId, selfName)
      if (ack.gameState) applyGameState(state, ack.gameState)
    }),
  setRoomSnapshot: (snapshot) =>
    set((state) => {
      applyRoomSnapshot(state, snapshot, state.playerId, state.displayName ?? undefined)
    }),
  addChatMessage: (message) =>
    set((state) => {
      if (state.messages.some((item) => item.id === message.id)) return
      const senderName = message.senderName ?? state.playerNamesById[message.senderId]
      if (senderName) state.playerNamesById[message.senderId] = senderName
      state.messages.push({ ...message, senderName })
      if (!state.isChatOpen && message.senderId !== state.playerId) state.unreadMessageCount += 1
    }),
  setChatHistoryPage: (messages, nextCursor, mode) =>
    set((state) => {
      const existingIds = new Set(state.messages.map((message) => message.id))
      const uniqueMessages = messages.filter((message) => !existingIds.has(message.id))

      for (const message of uniqueMessages) {
        if (message.senderName) state.playerNamesById[message.senderId] = message.senderName
      }

      if (mode === 'replace') {
        state.messages = [...uniqueMessages].reverse()
      } else {
        state.messages = [...uniqueMessages].reverse().concat(state.messages)
      }

      state.nextChatCursor = nextCursor ?? null
      state.hasOlderChatMessages = Boolean(nextCursor)
      state.isLoadingOlderMessages = false
    }),
  setChatHistoryLoading: (isLoading) =>
    set((state) => {
      state.isLoadingOlderMessages = isLoading
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
      applyGameState(state, gameState)
    }),
  addGameEvent: (event) =>
    set((state) => {
      state.gameEvents.push(event)
      const acceptedCity = event.payload.acceptedCity
      if (acceptedCity && !state.acceptedCities.some((city) => city.cityHash === acceptedCity.cityHash)) {
        state.acceptedCities.push(toAcceptedCity(acceptedCity))
        state.currentCity = toAcceptedCity(acceptedCity)
        state.wordsSubmitted = ['atlas', ...state.acceptedCities.map((city) => city.name)]
      }
    }),
  setServerError: (error) =>
    set((state) => {
      state.serverError = error
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

const applyRoomSnapshot = (
  state: MyState,
  snapshot: RoomSnapshot,
  selfPlayerId: string | null,
  fallbackSelfName?: string,
) => {
  state.turnMode = (snapshot.turnMode || 'strict-turns') as TurnMode
  state.currentTurnPlayerId = snapshot.currentTurnPlayerId || null
  state.currentTurnPlayerName = snapshot.currentTurnPlayerName || null
  state.realtimePlayers = snapshot.players.map((player) => {
    const isSelf = player.playerId === selfPlayerId
    const name = isSelf && fallbackSelfName ? fallbackSelfName : player.name || player.playerId
    state.playerNamesById[player.playerId] = name
    return {
      id: player.playerId,
      name,
      hearts: player.hearts,
      score: player.score,
      connected: player.connected,
      isSelf,
      active: state.turnMode === 'strict-turns' && player.playerId === state.currentTurnPlayerId,
    } satisfies PlayerSummary
  })
}

const applyGameState = (state: MyState, gameState: AtlasGameState) => {
  state.gameState = gameState
  state.currentTurnPlayerId = gameState.currentTurnPlayerId || null
  state.currentTurnPlayerName = gameState.currentTurnPlayerName || null
  state.acceptedCities = gameState.acceptedCities.map(toAcceptedCity)
  state.currentCity = state.acceptedCities.at(-1) ?? null
  state.wordsSubmitted = ['atlas', ...state.acceptedCities.map((city) => city.name)]
  state.realtimePlayers.forEach((player) => {
    player.active = state.turnMode === 'strict-turns' && player.id === state.currentTurnPlayerId
  })
}

const toAcceptedCity = (city: AtlasGameState['acceptedCities'][number]): AcceptedCity => ({
  cityHash: city.cityHash,
  name: city.name,
  country: city.country,
  lat: city.lat,
  lng: city.lng,
  submittedByPlayerId: city.submittedByPlayerId,
  submittedByName: city.submittedByName,
  submittedAt: city.submittedAt,
})
