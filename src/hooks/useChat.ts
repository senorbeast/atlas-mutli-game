'use client'

import { useCallback } from 'react'
import { atlasClient } from '@/network/atlasClient'
import useStore from '@/store/store'

export const useChat = () => {
  const messages = useStore((state) => state.messages)
  const playerId = useStore((state) => state.playerId)
  const displayName = useStore((state) => state.displayName)
  const connectionStatus = useStore((state) => state.connectionStatus)
  const unreadMessageCount = useStore((state) => state.unreadMessageCount)
  const isChatOpen = useStore((state) => state.isChatOpen)
  const playerNamesById = useStore((state) => state.playerNamesById)
  const setChatOpen = useStore((state) => state.setChatOpen)

  const canSend = connectionStatus === 'connected'

  const sendChat = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || !canSend) return false
      atlasClient.sendChat(trimmed)
      return true
    },
    [canSend],
  )

  const getSenderName = useCallback(
    (senderId: string, senderName?: string) => {
      if (senderId === playerId) return displayName ?? 'You'
      return senderName ?? playerNamesById[senderId] ?? senderId
    },
    [displayName, playerId, playerNamesById],
  )

  return {
    messages,
    playerId,
    displayName,
    unreadMessageCount,
    isChatOpen,
    setChatOpen,
    sendChat,
    getSenderName,
    canSend,
  }
}
