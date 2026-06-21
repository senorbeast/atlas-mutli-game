import { create, fromBinary, toBinary } from '@bufbuild/protobuf'
import { ClientToServerMessageSchema, ClientToServerMessageType } from '@/protocol/generated/client_server_message_pb'
import { ChatMessagePayloadSchema } from '@/protocol/generated/chat_message_payload_pb'
import { GameUpdatePayloadSchema } from '@/protocol/generated/game_message_payload_pb'
import {
  ServerToClientMessageSchema,
  ServerToClientMessageType,
  type ServerToClientMessage,
} from '@/protocol/generated/server_client_message_pb'
import type { AtlasGameState, AtlasGameUpdate, ChatEvent, ConnectAck, GameEvent } from '@/protocol/types'

const DEFAULT_WS_BASE_URL = 'ws://localhost:8080'

type AtlasClientEventMap = {
  ack: ConnectAck
  chat: ChatEvent
  gameState: AtlasGameState
  gameUpdate: GameEvent
  error: Error
  close: CloseEvent
}

type AtlasClientEvent = keyof AtlasClientEventMap
type Listener<TEvent extends AtlasClientEvent> = (payload: AtlasClientEventMap[TEvent]) => void

interface AtlasClientOptions {
  wsBaseUrl?: string
}

export class AtlasClient {
  private socket: WebSocket | null = null

  private roomId: string | null = null

  private playerId: string | null = null

  private readonly wsBaseUrl: string

  private readonly listeners = new Map<AtlasClientEvent, Set<Listener<AtlasClientEvent>>>()

  constructor(options: AtlasClientOptions = {}) {
    this.wsBaseUrl = options.wsBaseUrl ?? process.env.NEXT_PUBLIC_ATLAS_WS_URL ?? DEFAULT_WS_BASE_URL
  }

  connect(roomId: string): Promise<ConnectAck> {
    this.disconnect()
    this.roomId = roomId

    const socket = new WebSocket(`${this.wsBaseUrl.replace(/\/$/, '')}/${roomId}`)
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

  sendGameUpdate(update: AtlasGameUpdate) {
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

  private handleMessage = async (event: MessageEvent<ArrayBuffer | Blob>) => {
    try {
      const bytes =
        event.data instanceof Blob ? new Uint8Array(await event.data.arrayBuffer()) : new Uint8Array(event.data)
      const message = fromBinary(ServerToClientMessageSchema, bytes)
      this.dispatchServerMessage(message)
    } catch (error) {
      this.emit('error', error instanceof Error ? error : new Error('Unable to decode Atlas message'))
    }
  }

  private handleClose = (event: CloseEvent) => {
    this.socket = null
    this.emit('close', event)
  }

  private dispatchServerMessage(message: ServerToClientMessage) {
    switch (message.messageType) {
      case ServerToClientMessageType.SEND_ON_CONNECT_ACK:
        if (message.payload.case !== 'onConnectAckPayload') return
        this.playerId = message.payload.value.playerId
        this.roomId = message.payload.value.roomId
        this.emit('ack', {
          roomId: message.payload.value.roomId,
          playerId: message.payload.value.playerId,
        })
        break
      case ServerToClientMessageType.BROADCAST_CHAT_MESSAGE:
        if (message.payload.case !== 'chatMessagePayload') return
        this.emit('chat', {
          id: crypto.randomUUID(),
          roomId: this.roomId ?? '',
          senderId: message.payload.value.senderId,
          content: message.payload.value.content,
          receivedAt: new Date().toISOString(),
        })
        break
      case ServerToClientMessageType.RESPOND_GAME_STATE:
        if (message.payload.case === 'gameStatePayload') this.emit('gameState', message.payload.value)
        break
      case ServerToClientMessageType.BROADCAST_GAME_UPDATE:
        if (message.payload.case !== 'gameUpdatePayload') return
        this.emit('gameUpdate', {
          id: crypto.randomUUID(),
          gameKind: 'atlas-word',
          payload: message.payload.value,
          receivedAt: new Date().toISOString(),
        })
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
