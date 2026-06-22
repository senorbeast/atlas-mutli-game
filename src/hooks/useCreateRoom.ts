'use client'

import { useCallback, useState } from 'react'
import type { GameKind, RoomMetadata, TurnMode } from '@/protocol/types'

interface CreateRoomResponse {
  roomId: string
  gameKind?: GameKind
  status?: RoomMetadata['status']
  turnMode?: TurnMode
}

export interface CreatedRoom extends RoomMetadata {
  gameKind: GameKind
}

export const useCreateRoom = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRoom = useCallback(async (): Promise<CreatedRoom> => {
    setIsCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error(`Unable to create room (${response.status})`)
      }

      const data = (await response.json()) as CreateRoomResponse
      if (!data.roomId) throw new Error('Backend did not return a room id')

      return {
        roomId: data.roomId,
        gameKind: data.gameKind ?? 'atlas-word',
        status: data.status ?? 'waiting',
        maxPlayers: 8,
        isStarted: false,
        turnMode: data.turnMode ?? 'strict-turns',
      }
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'Unable to create room'
      setError(message)
      throw createError
    } finally {
      setIsCreating(false)
    }
  }, [])

  return { createRoom, isCreating, error }
}
