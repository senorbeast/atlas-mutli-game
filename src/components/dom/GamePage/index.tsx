import Chat from './Chat'
import SettingsBar from './SettingsBar'
import PrevWords from './PrevWords'
import GameInput from './GameInput'
import { JoinRoomGate } from './JoinRoomGate'
import { PlayerColumns } from './PlayerColumns'
import { ShareRoomButton } from './ShareRoomButton'
import { TurnStatus } from './TurnStatus'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useAtlasRealtime } from '@/hooks/useAtlasRealtime'
import useStore from '@/store/store'

interface GamePageProps {
  roomId: string | null
}

const GamePage = ({ roomId }: GamePageProps) => {
  const displayName = useStore((state) => state.displayName)
  const { connectionStatus, realtimeError } = useAtlasRealtime(roomId, Boolean(displayName))
  const players = useStore((state) => state.realtimePlayers)
  const previousConnectionStatus = useRef(connectionStatus)

  useEffect(() => {
    if (realtimeError) toast.error(realtimeError)
  }, [realtimeError])

  useEffect(() => {
    if (previousConnectionStatus.current !== 'connected' && connectionStatus === 'connected' && roomId) {
      toast.success(`${displayName ?? 'Player'} joined room ${roomId}`)
    }
    previousConnectionStatus.current = connectionStatus
  }, [connectionStatus, displayName, roomId])

  return (
    <>
      {roomId && !displayName ? <JoinRoomGate roomId={roomId} /> : null}
      <PlayerColumns players={players} />
      <div className='absolute bottom-3 right-3 z-20 block pointer-events-auto'>
        <Chat realtimeError={realtimeError} />
      </div>
      <div className='absolute bottom-3 left-3 z-20 block pointer-events-auto'>
        <ShareRoomButton roomId={roomId} />
      </div>
      <div className='absolute right-4 top-3 block pointer-events-auto'>
        <SettingsBar />
      </div>
      <div className='absolute bottom-8 flex w-screen justify-center px-4'>
        <div className='flex w-[min(28rem,calc(100vw-2rem))] flex-col items-center gap-2'>
          <TurnStatus />
          <GameInput />
          <PrevWords />
        </div>
      </div>
    </>
  )
}

export default GamePage
