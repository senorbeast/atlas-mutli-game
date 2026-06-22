import { create, fromBinary, toBinary } from '@bufbuild/protobuf'
import { findCityByName } from '@/data/cities'
import { ClientToServerMessageSchema, ClientToServerMessageType } from '@/protocol/generated/client_server_message_pb'
import { ChatMessagePayloadSchema } from '@/protocol/generated/chat_message_payload_pb'
import { GameUpdatePayloadSchema } from '@/protocol/generated/game_message_payload_pb'
import type { AcceptedCity as ProtocolAcceptedCity } from '@/protocol/generated/game_message_payload_pb'
import { JoinRoomPayloadSchema } from '@/protocol/generated/other_payloads_pb'
import {
  ServerToClientMessageSchema,
  ServerToClientMessageType,
  type ServerToClientMessage,
} from '@/protocol/generated/server_client_message_pb'
import type {
  AtlasGameState,
  AtlasGameUpdate,
  AtlasGameUpdateInput,
  ChatEvent,
  ChatHistoryPage,
  ConnectAck,
  GameEvent,
  GameKind,
  ServerErrorEvent,
  TurnMode,
} from '@/protocol/types'

const DEFAULT_WS_BASE_URL = 'ws://localhost:8080'
const DEFAULT_HTTP_BASE_URL = ''

type AtlasClientEventMap = {
  ack: ConnectAck
  chat: ChatEvent
  gameState: AtlasGameState
  gameUpdate: GameEvent
  roomUpdate: NonNullable<ConnectAck['room']>
  serverError: ServerErrorEvent
  error: Error
  close: CloseEvent
}

type AtlasClientEvent = keyof AtlasClientEventMap
type Listener<TEvent extends AtlasClientEvent> = (payload: AtlasClientEventMap[TEvent]) => void

interface AtlasClientOptions {
  wsBaseUrl?: string
  httpBaseUrl?: string
}

interface ConnectOptions {
  displayName: string
  gameKind?: GameKind
  turnMode?: TurnMode
}

interface ChatHistoryMessageResponse {
  messageId: string
  senderId: string
  senderName?: string
  content: string
  createdAt: string
}

interface ChatHistoryResponse {
  messages: ChatHistoryMessageResponse[]
  nextCursor?: string
}

export class AtlasClient {
  private socket: WebSocket | null = null

  private roomId: string | null = null

  private playerId: string | null = null

  private serverErrorId = 0

  private readonly wsBaseUrl: string

  private readonly httpBaseUrl: string

  private readonly listeners = new Map<AtlasClientEvent, Set<Listener<AtlasClientEvent>>>()

  constructor(options: AtlasClientOptions = {}) {
    this.wsBaseUrl = options.wsBaseUrl ?? process.env.NEXT_PUBLIC_ATLAS_WS_URL ?? DEFAULT_WS_BASE_URL
    this.httpBaseUrl = options.httpBaseUrl ?? process.env.NEXT_PUBLIC_ATLAS_HTTP_URL ?? DEFAULT_HTTP_BASE_URL
  }

  connect(roomId: string, options: ConnectOptions): Promise<ConnectAck> {
    this.disconnect()
    this.roomId = roomId
    this.playerId = null

    const socket = new WebSocket(`${this.wsBaseUrl.replace(/\/$/, '')}/rooms/${roomId}/ws`)
    socket.binaryType = 'arraybuffer'
    this.socket = socket

    return new Promise((resolve, reject) => {
      const handleAck = (ack: ConnectAck) => {
        cleanup()
        resolve(ack)
      }
      const handleError = (error: Error) => {
        cleanup()
        reject(error)
      }
      const cleanup = () => {
        this.off('ack', handleAck)
        this.off('error', handleError)
      }

      this.on('ack', handleAck)
      this.on('error', handleError)

      socket.addEventListener('open', () => this.sendJoin(options))
      socket.addEventListener('message', this.handleMessage)
      socket.addEventListener('error', () => this.emit('error', new Error('Atlas WebSocket connection failed')))
      socket.addEventListener('close', this.handleClose)
    })
  }

  disconnect() {
    if (!this.socket) return

    this.socket.removeEventListener('message', this.handleMessage)
    this.socket.removeEventListener('close', this.handleClose)
    this.socket.close()
    this.socket = null
    this.roomId = null
    this.playerId = null
  }

  async fetchChatHistory(roomId: string, before?: string, limit = 50): Promise<ChatHistoryPage> {
    const params = new URLSearchParams({ limit: String(limit) })
    if (before) params.set('before', before)

    const response = await fetch(`${this.httpBaseUrl}/api/rooms/${roomId}/chat?${params.toString()}`, {
      cache: 'no-store',
    })
    if (!response.ok) throw new Error('Unable to load chat history')

    const page = (await response.json()) as ChatHistoryResponse
    return {
      messages: page.messages.map((message) => ({
        id: message.messageId,
        roomId,
        senderId: message.senderId,
        senderName: message.senderName,
        content: message.content,
        receivedAt: message.createdAt,
      })),
      nextCursor: page.nextCursor,
    }
  }

  sendChat(content: string) {
    const trimmed = content.trim()
    if (!trimmed) return

    const chatPayload = create(ChatMessagePayloadSchema, {
      senderId: this.playerId ?? '',
      content: trimmed,
    })
    const message = create(ClientToServerMessageSchema, {
      messageType: ClientToServerMessageType.SEND_CHAT_MESSAGE,
      payload: {
        case: 'chatMessagePayload',
        value: chatPayload,
      },
    })

    this.sendBinary(toBinary(ClientToServerMessageSchema, message))
  }

  requestGameState() {
    const message = create(ClientToServerMessageSchema, {
      messageType: ClientToServerMessageType.REQUEST_GAME_STATE,
      payload: { case: undefined },
    })
    this.sendBinary(toBinary(ClientToServerMessageSchema, message))
  }

  sendGameUpdate(update: AtlasGameUpdateInput) {
    const updatePayload = create(GameUpdatePayloadSchema, update)
    const message = create(ClientToServerMessageSchema, {
      messageType: ClientToServerMessageType.SEND_GAME_UPDATE,
      payload: {
        case: 'gameUpdatePayload',
        value: updatePayload,
      },
    })

    this.sendBinary(toBinary(ClientToServerMessageSchema, message))
  }

  on<TEvent extends AtlasClientEvent>(event: TEvent, listener: Listener<TEvent>) {
    const listeners = this.listeners.get(event) ?? new Set()
    listeners.add(listener as Listener<AtlasClientEvent>)
    this.listeners.set(event, listeners)
  }

  off<TEvent extends AtlasClientEvent>(event: TEvent, listener: Listener<TEvent>) {
    this.listeners.get(event)?.delete(listener as Listener<AtlasClientEvent>)
  }

  private sendBinary(payload: Uint8Array) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.emit('error', new Error('Atlas WebSocket is not connected'))
      return
    }

    this.socket.send(new Uint8Array(payload).buffer)
  }

  private sendJoin(options: ConnectOptions) {
    const joinPayload = create(JoinRoomPayloadSchema, {
      displayName: options.displayName,
      gameKind: options.gameKind ?? 'atlas-word',
      turnMode: options.turnMode ?? 'strict-turns',
    })
    const message = create(ClientToServerMessageSchema, {
      messageType: ClientToServerMessageType.JOIN_ROOM,
      payload: {
        case: 'joinRoomPayload',
        value: joinPayload,
      },
    })
    this.sendBinary(toBinary(ClientToServerMessageSchema, message))
  }

  private handleMessage = async (event: MessageEvent<ArrayBuffer | Blob>) => {
    try {
      const bytes =
        event.data instanceof Blob ? new Uint8Array(await event.data.arrayBuffer()) : new Uint8Array(event.data)
      const message = fromBinary(ServerToClientMessageSchema, bytes)
      await this.dispatchServerMessage(message)
    } catch (error) {
      this.emit('error', error instanceof Error ? error : new Error('Unable to decode Atlas message'))
    }
  }

  private handleClose = (event: CloseEvent) => {
    this.socket = null
    this.emit('close', event)
  }

  private async dispatchServerMessage(message: ServerToClientMessage) {
    switch (message.messageType) {
      case ServerToClientMessageType.SEND_ON_CONNECT_ACK:
        if (message.payload.case !== 'onConnectAckPayload') return
        this.playerId = message.payload.value.playerId
        this.roomId = message.payload.value.roomId
        this.emit('ack', {
          roomId: message.payload.value.roomId,
          playerId: message.payload.value.playerId,
          gameKind: message.payload.value.gameKind as GameKind,
          turnMode: (message.payload.value.turnMode || 'strict-turns') as TurnMode,
          room: message.payload.value.room,
          gameState: message.payload.value.gameState
            ? {
                ...message.payload.value.gameState,
                acceptedCities: await Promise.all(
                  message.payload.value.gameState.acceptedCities.map(enrichAcceptedCity),
                ),
              }
            : undefined,
        })
        break
      case ServerToClientMessageType.BROADCAST_CHAT_MESSAGE:
        if (message.payload.case !== 'chatMessagePayload') return
        this.emit('chat', {
          id: message.payload.value.messageId || crypto.randomUUID(),
          roomId: this.roomId ?? '',
          senderId: message.payload.value.senderId,
          senderName: message.payload.value.senderName,
          content: message.payload.value.content,
          receivedAt: message.payload.value.createdAt || new Date().toISOString(),
        })
        break
      case ServerToClientMessageType.RESPOND_GAME_STATE:
        if (message.payload.case === 'gameStatePayload') {
          this.emit('gameState', {
            ...message.payload.value,
            acceptedCities: await Promise.all(message.payload.value.acceptedCities.map(enrichAcceptedCity)),
          })
        }
        break
      case ServerToClientMessageType.BROADCAST_GAME_UPDATE:
        if (message.payload.case !== 'gameUpdatePayload') return
        const acceptedCity = message.payload.value.acceptedCity
        this.emit('gameUpdate', {
          id: crypto.randomUUID(),
          gameKind: 'atlas-word',
          payload: {
            ...message.payload.value,
            acceptedCity: acceptedCity ? await enrichAcceptedCity(acceptedCity) : undefined,
          },
          receivedAt: new Date().toISOString(),
        })
        break
      case ServerToClientMessageType.BROADCAST_ROOM_UPDATE:
        if (message.payload.case !== 'roomUpdatePayload' || !message.payload.value.room) return
        this.emit('roomUpdate', message.payload.value.room)
        break
      case ServerToClientMessageType.SEND_ERROR:
        if (message.payload.case !== 'errorPayload') return
        const serverError = {
          id: ++this.serverErrorId,
          code: message.payload.value.code,
          message: message.payload.value.message || message.payload.value.code,
        }
        this.emit('serverError', serverError)
        if (!this.playerId) this.emit('error', new Error(serverError.message))
        break
      default:
        break
    }
  }

  private emit<TEvent extends AtlasClientEvent>(event: TEvent, payload: AtlasClientEventMap[TEvent]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload))
  }
}

export const atlasClient = new AtlasClient()

const enrichAcceptedCity = async (city: ProtocolAcceptedCity) => {
  const details = await findCityByName(city.name).catch(() => null)

  return {
    cityHash: city.cityHash,
    name: city.name,
    country: details?.country ?? '',
    lat: details?.lat ?? 0,
    lng: details?.lng ?? 0,
    submittedByPlayerId: city.submittedByPlayerId,
    submittedByName: city.submittedByName,
    submittedAt: city.submittedAt,
  }
}
