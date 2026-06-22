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
  const roomId = useStore((state) => state.roomId)
  const hasOlderChatMessages = useStore((state) => state.hasOlderChatMessages)
  const nextChatCursor = useStore((state) => state.nextChatCursor)
  const isLoadingOlderMessages = useStore((state) => state.isLoadingOlderMessages)
  const playerNamesById = useStore((state) => state.playerNamesById)
  const setChatOpen = useStore((state) => state.setChatOpen)
  const setChatHistoryPage = useStore((state) => state.setChatHistoryPage)
  const setChatHistoryLoading = useStore((state) => state.setChatHistoryLoading)

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

  const loadOlderMessages = useCallback(async () => {
    if (!roomId || !hasOlderChatMessages || !nextChatCursor || isLoadingOlderMessages) return

    setChatHistoryLoading(true)
    try {
      const page = await atlasClient.fetchChatHistory(roomId, nextChatCursor)
      setChatHistoryPage(page.messages, page.nextCursor, 'prepend')
    } catch {
      setChatHistoryLoading(false)
    }
  }, [hasOlderChatMessages, isLoadingOlderMessages, nextChatCursor, roomId, setChatHistoryLoading, setChatHistoryPage])

  return {
    messages,
    playerId,
    displayName,
    unreadMessageCount,
    isChatOpen,
    hasOlderChatMessages,
    isLoadingOlderMessages,
    setChatOpen,
    loadOlderMessages,
    sendChat,
    getSenderName,
    canSend,
  }
}
