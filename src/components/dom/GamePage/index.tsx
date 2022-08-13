import { useState } from 'react'

interface player {
  id: number
  name: string
  hearts: number
}

const playerList: player[] = [
  {
    id: 1,
    name: 'Player 1',
    hearts: 1,
  },
  {
    id: 2,
    name: 'Player 1',
    hearts: 1,
  },
  {
    id: 3,
    name: 'Player 1',
    hearts: 1,
  },
  {
    id: 4,
    name: 'Player 1',
    hearts: 1,
  },
]

const Player = ({ ...props }: player) => {
  return (
    <div>
      <div className='flex items-center justify-center border h-36 w-36'>
        <span className='text-9xl'>{props.name[0]}</span>
      </div>
      {/* <input placeholder='Guess' className='input'></input> */}
    </div>
  )
}

const GamePage = () => {
  return (
    <>
      <div className='flex flex-col border border-green-900 justify-evenly'>
        {playerList.map((player) => (
          <Player key={player.id} {...player} />
        ))}
      </div>
    </>
  )
}

export default GamePage
