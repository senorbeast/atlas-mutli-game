import Chat from './Chat'
import SettingsBar from './SettingsBar'
import { Player } from './Player'
import PrevWords from './PrevWords'
import GameInput from './GameInput'
import { JoinRoomGate } from './JoinRoomGate'
import { ShareIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAtlasRealtime } from '@/hooks/useAtlasRealtime'
import useStore from '@/store/store'
import type { PlayerSummary } from '@/protocol/types'

// Identify player individually

export interface player {
  id: string
  name: string
  active: boolean
  hearts: number
}

const playerList: (PlayerSummary & { active: boolean })[] = [
  {
    id: '1',
    name: 'Player 1',
    active: false,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
  {
    id: '2',
    name: 'Player 2',
    active: false,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
  {
    id: '3',
    name: 'Player 3',
    active: false,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
  {
    id: '4',
    name: 'Player 4',
    active: false,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
  {
    id: '5',
    name: 'Player 5',
    active: false,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
  {
    id: '6',
    name: 'Player 6',
    active: true,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
  {
    id: '7',
    name: 'Player 7',
    active: false,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
  {
    id: '8',
    name: 'Player 8',
    active: false,
    hearts: 1,
    score: 0,
    isSelf: false,
  },
]

interface GamePageProps {
  roomId: string | null
}

const GamePage = ({ roomId }: GamePageProps) => {
  const displayName = useStore((state) => state.displayName)
  const { connectionStatus, realtimeError } = useAtlasRealtime(roomId, Boolean(displayName))
  const playerId = useStore((state) => state.playerId)
  const realtimePlayers = useStore((state) => state.realtimePlayers)
  const players = realtimePlayers.length > 0 ? realtimePlayers : playerList
  const previousConnectionStatus = useRef(connectionStatus)
  const [manualShareUrl, setManualShareUrl] = useState<string | null>(null)

  useEffect(() => {
    if (realtimeError) toast.error(realtimeError)
  }, [realtimeError])

  useEffect(() => {
    if (previousConnectionStatus.current !== 'connected' && connectionStatus === 'connected' && roomId) {
      toast.success(`${displayName ?? 'Player'} joined room ${roomId}`)
    }
    previousConnectionStatus.current = connectionStatus
  }, [connectionStatus, displayName, roomId])

  const copyRoomUrl = async (roomUrl: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(roomUrl)
      return
    }

    const textArea = document.createElement('textarea')
    textArea.value = roomUrl
    textArea.setAttribute('readonly', 'true')
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()

    const copied = document.execCommand('copy')
    document.body.removeChild(textArea)
    if (!copied) throw new Error('Clipboard copy was not available')
  }

  const shareRoom = async () => {
    if (!roomId) return

    const roomUrl = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my Atlas room',
          text: `Join my Atlas room ${roomId}`,
          url: roomUrl,
        })
        setManualShareUrl(null)
        toast.success('Room link shared')
        return
      }

      await copyRoomUrl(roomUrl)
      setManualShareUrl(null)
      toast.success('Room link copied')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setManualShareUrl(roomUrl)
      toast.error('Copy unavailable. Room link shown below.')
    }
  }

  return (
    <>
      {roomId && !displayName ? <JoinRoomGate roomId={roomId} /> : null}
      <div className='absolute z-20 flex flex-col items-start gap-1 pointer-events-auto top-3 left-3'>
        <div className='px-4 py-2 text-sm font-semibold rounded-full standard-color standard-border'>
          {roomId ? `Room ${roomId}` : 'Local preview'}
        </div>
        <div className='px-4 py-2 text-sm rounded-full standard-color standard-border'>
          {roomId ? `Connection: ${connectionStatus}` : 'Create a room to connect'}
        </div>
        {displayName ? (
          <div className='px-4 py-2 text-sm rounded-full standard-color standard-border'>Name: {displayName}</div>
        ) : null}
        {playerId ? (
          <div className='px-4 py-2 text-sm rounded-full standard-color standard-border'>Player id: {playerId}</div>
        ) : null}
        {realtimeError ? (
          <div className='px-4 py-2 text-sm font-semibold text-red-600 rounded-full standard-color standard-border'>
            {realtimeError}
          </div>
        ) : null}
        {roomId ? (
          <>
            <button
              type='button'
              className='button flex items-center gap-2 rounded-lg px-4 py-2 text-sm'
              onClick={shareRoom}
            >
              <ShareIcon className='h-4 w-4' />
              Share
            </button>
            {manualShareUrl ? (
              <input
                readOnly
                aria-label='Room invite link'
                className='w-72 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow'
                value={manualShareUrl}
                onFocus={(event) => event.target.select()}
              />
            ) : null}
          </>
        ) : null}
      </div>
      {/* Game Section */}
      <div className='grid grid-cols-2 gap-2'>
        {players.map((player) => (
          <Player key={player.id} {...player} />
        ))}
      </div>
      {/* Chat Section */}
      <div className='absolute bottom-4 right-4 z-20 block pointer-events-auto'>
        <Chat />
      </div>
      {/* Settings Section */}
      <div className='absolute right-4 top-3 block pointer-events-auto'>
        <SettingsBar />
      </div>
      {/* Prev Words */}
      {/* <div className='absolute flex justify-center  w-screen blco bottom-32'>
        <PrevWords />
      </div> */}
      {/* Input Bar */}
      <div className='absolute bottom-8 flex w-screen justify-center'>
        <GameInput /> <PrevWords></PrevWords>
      </div>
    </>
  )
}

export default GamePage
