'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { atlasClient } from '@/network/atlasClient'
import type { AtlasGameState, ChatEvent, ConnectAck, GameEvent, ServerErrorEvent } from '@/protocol/types'
import type { RoomSnapshot } from '@/protocol/generated/other_payloads_pb'
import useStore from '@/store/store'

export const useAtlasRealtime = (roomId: string | null, canConnect = true) => {
  const missingTurnRepairKey = useRef<string | null>(null)
  const connectionStatus = useStore((state) => state.connectionStatus)
  const realtimeError = useStore((state) => state.realtimeError)
  const turnMode = useStore((state) => state.turnMode)
  const currentTurnPlayerId = useStore((state) => state.currentTurnPlayerId)
  const realtimePlayerCount = useStore((state) => state.realtimePlayers.length)

  useEffect(() => {
    let active = true

    if (!roomId) {
      useStore.getState().resetRealtime()
      return undefined
    }

    if (!canConnect) {
      useStore.getState().setConnectionStatus('idle')
      return undefined
    }

    const handleAck = (ack: ConnectAck) => {
      useStore.getState().setConnectAck(ack)
      void atlasClient
        .fetchChatHistory(ack.roomId)
        .then((page) => {
          if (!active) return
          useStore.getState().setChatHistoryPage(page.messages, page.nextCursor, 'replace')
        })
        .catch((error) => {
          if (!active) return
          useStore.getState().setRealtimeError(error instanceof Error ? error.message : 'Unable to load chat history')
        })
    }
    const handleChat = (message: ChatEvent) => useStore.getState().addChatMessage(message)
    const handleGameState = (state: AtlasGameState) => useStore.getState().setGameState(state)
    const handleGameUpdate = (event: GameEvent) => useStore.getState().addGameEvent(event)
    const handleRoomUpdate = (room: RoomSnapshot) => useStore.getState().setRoomSnapshot(room)
    const handleServerError = (error: ServerErrorEvent) => {
      useStore.getState().setServerError(error)
      if (error) {
        toast.error(error.message)
        if (error.code === 'not_your_turn' || error.code === 'no_connected_players') atlasClient.requestGameState()
      }
    }
    const handleError = (error: Error) => useStore.getState().setRealtimeError(error.message)
    const handleClose = () => useStore.getState().setConnectionStatus('disconnected')

    atlasClient.on('ack', handleAck)
    atlasClient.on('chat', handleChat)
    atlasClient.on('gameState', handleGameState)
    atlasClient.on('gameUpdate', handleGameUpdate)
    atlasClient.on('roomUpdate', handleRoomUpdate)
    atlasClient.on('serverError', handleServerError)
    atlasClient.on('error', handleError)
    atlasClient.on('close', handleClose)

    useStore.getState().setConnectionStatus('connecting')
    const displayName = useStore.getState().displayName ?? 'Player'
    atlasClient.connect(roomId, { displayName, gameKind: 'atlas-word' }).catch((error) => {
      if (!active) return
      useStore.getState().setRealtimeError(error instanceof Error ? error.message : 'Unable to connect to Atlas room')
    })

    return () => {
      active = false
      atlasClient.off('ack', handleAck)
      atlasClient.off('chat', handleChat)
      atlasClient.off('gameState', handleGameState)
      atlasClient.off('gameUpdate', handleGameUpdate)
      atlasClient.off('roomUpdate', handleRoomUpdate)
      atlasClient.off('serverError', handleServerError)
      atlasClient.off('error', handleError)
      atlasClient.off('close', handleClose)
      useStore.getState().setConnectionStatus('disconnecting')
      atlasClient.disconnect()
      useStore.getState().resetRealtime()
    }
  }, [roomId, canConnect])

  useEffect(() => {
    if (currentTurnPlayerId) {
      missingTurnRepairKey.current = null
      return undefined
    }
    if (!roomId || connectionStatus !== 'connected' || turnMode !== 'strict-turns' || realtimePlayerCount === 0) {
      return undefined
    }

    const repairKey = `${roomId}:${realtimePlayerCount}`
    if (missingTurnRepairKey.current === repairKey) return undefined
    missingTurnRepairKey.current = repairKey

    const timeout = window.setTimeout(() => {
      atlasClient.requestGameState()
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [connectionStatus, currentTurnPlayerId, realtimePlayerCount, roomId, turnMode])

  return { connectionStatus, realtimeError }
}
