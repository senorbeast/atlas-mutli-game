import type { GameStatePayload, GameUpdatePayload } from './generated/game_message_payload_pb'
import type { RoomSnapshot } from './generated/other_payloads_pb'

export type GameKind = 'atlas-word'
export type TurnMode = 'strict-turns' | 'free-for-all'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnecting' | 'disconnected' | 'error'

export interface ConnectAck {
  roomId: string
  playerId: string
  gameKind: GameKind
  turnMode: TurnMode
  room?: RoomSnapshot
  gameState?: AtlasGameState
}

export interface PlayerIdentity {
  name: string
}

export interface PlayerSummary {
  id: string
  name: string
  hearts: number
  score: number
  isSelf: boolean
  active?: boolean
  connected?: boolean
}

export interface ChatEvent {
  id: string
  roomId: string
  senderId: string
  senderName?: string
  content: string
  receivedAt: string
}

export interface ServerErrorEvent {
  id: number
  code: string
  message: string
}

export interface CityEntry {
  name: string
  country: string
  lat: number
  lng: number
}

export interface AcceptedCity extends CityEntry {
  cityHash: string
  submittedByPlayerId?: string
  submittedByName?: string
  submittedAt: string
}

export interface RoomMetadata {
  roomId: string
  gameKind: GameKind
  status: 'waiting' | 'playing' | 'ended'
  maxPlayers: number
  isStarted: boolean
  turnMode: TurnMode
}

export type AtlasGameState = Omit<GameStatePayload, 'acceptedCities'> & {
  acceptedCities: AcceptedCity[]
}
export type AtlasGameUpdate = Omit<GameUpdatePayload, 'acceptedCity'> & {
  acceptedCity?: AcceptedCity
}
export interface AtlasGameUpdateInput {
  level?: number
  type: string
  gameKind: GameKind
  cityName?: string
  acceptedCity?: GameUpdatePayload['acceptedCity']
  errorCode?: string
  errorMessage?: string
}

export interface ChatHistoryPage {
  messages: ChatEvent[]
  nextCursor?: string
}

export interface GameEvent<TPayload = AtlasGameUpdate> {
  id: string
  gameKind: GameKind
  payload: TPayload
  receivedAt: string
}
