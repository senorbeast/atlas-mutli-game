import { Player } from './Player'
import type { PlayerSummary } from '@/protocol/types'

interface PlayerColumnsProps {
  players: PlayerSummary[]
}

export function PlayerColumns({ players }: PlayerColumnsProps) {
  const leftPlayers = players.filter((_, index) => index % 2 === 0)
  const rightPlayers = players.filter((_, index) => index % 2 === 1)

  return (
    <>
      <div className='pointer-events-auto absolute left-3 top-20 z-20 flex w-48 max-w-[42vw] flex-col gap-2'>
        {leftPlayers.map((player) => (
          <Player key={player.id} {...player} align='left' />
        ))}
      </div>
      <div className='pointer-events-auto absolute right-3 top-20 z-20 flex w-48 max-w-[42vw] flex-col gap-2'>
        {rightPlayers.map((player) => (
          <Player key={player.id} {...player} align='right' />
        ))}
      </div>
    </>
  )
}
