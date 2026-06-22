'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { atlasClient } from '@/network/atlasClient'
import useStore from '@/store/store'

export const useAtlasRealtime = (roomId: string | null, canConnect = true) => {
  const missingTurnRepairKey = useRef<string | null>(null)
  const connectionStatus = useStore((state) => state.connectionStatus)
  const realtimeError = useStore((state) => state.realtimeError)
  const turnMode = useStore((state) => state.turnMode)
  const currentTurnPlayerId = useStore((state) => state.currentTurnPlayerId)
  const realtimePlayerCount = useStore((state) => state.realtimePlayers.length)
  const setConnectionStatus = useStore((state) => state.setConnectionStatus)
  const setConnectAck = useStore((state) => state.setConnectAck)
  const displayName = useStore((state) => state.displayName)
  const addChatMessage = useStore((state) => state.addChatMessage)
  const setChatHistoryPage = useStore((state) => state.setChatHistoryPage)
  const setGameState = useStore((state) => state.setGameState)
  const addGameEvent = useStore((state) => state.addGameEvent)
  const setRoomSnapshot = useStore((state) => state.setRoomSnapshot)
  const setServerError = useStore((state) => state.setServerError)
  const setRealtimeError = useStore((state) => state.setRealtimeError)
  const resetRealtime = useStore((state) => state.resetRealtime)

  useEffect(() => {
    if (!roomId) {
      resetRealtime()
      return undefined
    }

    if (!canConnect) {
      setConnectionStatus('idle')
      return undefined
    }

    const handleAck = (ack: Parameters<typeof setConnectAck>[0]) => {
      setConnectAck(ack)
      void atlasClient
        .fetchChatHistory(ack.roomId)
        .then((page) => setChatHistoryPage(page.messages, page.nextCursor, 'replace'))
        .catch((error) => {
          setRealtimeError(error instanceof Error ? error.message : 'Unable to load chat history')
        })
    }
    const handleChat = addChatMessage
    const handleGameState = setGameState
    const handleGameUpdate = addGameEvent
    const handleRoomUpdate = setRoomSnapshot
    const handleServerError = (error: Parameters<typeof setServerError>[0]) => {
      setServerError(error)
      if (error) {
        toast.error(error.message)
        if (error.code === 'not_your_turn' || error.code === 'no_connected_players') atlasClient.requestGameState()
      }
    }
    const handleError = (error: Error) => setRealtimeError(error.message)
    const handleClose = () => setConnectionStatus('disconnected')

    atlasClient.on('ack', handleAck)
    atlasClient.on('chat', handleChat)
    atlasClient.on('gameState', handleGameState)
    atlasClient.on('gameUpdate', handleGameUpdate)
    atlasClient.on('roomUpdate', handleRoomUpdate)
    atlasClient.on('serverError', handleServerError)
    atlasClient.on('error', handleError)
    atlasClient.on('close', handleClose)

    setConnectionStatus('connecting')
    atlasClient.connect(roomId, { displayName: displayName ?? 'Player', gameKind: 'atlas-word' }).catch((error) => {
      setRealtimeError(error instanceof Error ? error.message : 'Unable to connect to Atlas room')
    })

    return () => {
      atlasClient.off('ack', handleAck)
      atlasClient.off('chat', handleChat)
      atlasClient.off('gameState', handleGameState)
      atlasClient.off('gameUpdate', handleGameUpdate)
      atlasClient.off('roomUpdate', handleRoomUpdate)
      atlasClient.off('serverError', handleServerError)
      atlasClient.off('error', handleError)
      atlasClient.off('close', handleClose)
      setConnectionStatus('disconnecting')
      atlasClient.disconnect()
      resetRealtime()
    }
  }, [
    addChatMessage,
    addGameEvent,
    resetRealtime,
    roomId,
    setConnectAck,
    setConnectionStatus,
    setGameState,
    setRoomSnapshot,
    setServerError,
    setRealtimeError,
    setChatHistoryPage,
    canConnect,
    displayName,
  ])

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
