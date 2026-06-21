import type { GameStatePayload, GameUpdatePayload } from './generated/game_message_payload_pb'

export type GameKind = 'atlas-word'

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnecting' | 'disconnected' | 'error'

export interface ConnectAck {
  roomId: string
  playerId: string
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
}

export interface ChatEvent {
  id: string
  roomId: string
  senderId: string
  senderName?: string
  content: string
  receivedAt: string
}

export interface CityEntry {
  name: string
  country: string
  lat: number
  lng: number
}

export interface AcceptedCity extends CityEntry {
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
}

export type AtlasGameState = GameStatePayload
export type AtlasGameUpdate = GameUpdatePayload

export interface GameEvent<TPayload = AtlasGameUpdate> {
  id: string
  gameKind: GameKind
  payload: TPayload
  receivedAt: string
}
