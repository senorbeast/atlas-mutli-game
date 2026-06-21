'use client'

import { useEffect } from 'react'
import { atlasClient } from '@/network/atlasClient'
import useStore from '@/store/store'

export const useAtlasRealtime = (roomId: string | null, canConnect = true) => {
  const connectionStatus = useStore((state) => state.connectionStatus)
  const realtimeError = useStore((state) => state.realtimeError)
  const setConnectionStatus = useStore((state) => state.setConnectionStatus)
  const setConnectAck = useStore((state) => state.setConnectAck)
  const addChatMessage = useStore((state) => state.addChatMessage)
  const setGameState = useStore((state) => state.setGameState)
  const addGameEvent = useStore((state) => state.addGameEvent)
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

    const handleAck = setConnectAck
    const handleChat = addChatMessage
    const handleGameState = setGameState
    const handleGameUpdate = addGameEvent
    const handleError = (error: Error) => setRealtimeError(error.message)
    const handleClose = () => setConnectionStatus('disconnected')

    atlasClient.on('ack', handleAck)
    atlasClient.on('chat', handleChat)
    atlasClient.on('gameState', handleGameState)
    atlasClient.on('gameUpdate', handleGameUpdate)
    atlasClient.on('error', handleError)
    atlasClient.on('close', handleClose)

    setConnectionStatus('connecting')
    atlasClient.connect(roomId).catch((error) => {
      setRealtimeError(error instanceof Error ? error.message : 'Unable to connect to Atlas room')
    })

    return () => {
      atlasClient.off('ack', handleAck)
      atlasClient.off('chat', handleChat)
      atlasClient.off('gameState', handleGameState)
      atlasClient.off('gameUpdate', handleGameUpdate)
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
    setRealtimeError,
    canConnect,
  ])

  return { connectionStatus, realtimeError }
}
