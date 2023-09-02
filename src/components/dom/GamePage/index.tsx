import Chat from './Chat'
import SettingsBar from './SettingsBar'
import { Player } from './Player'

// Identify player individually

export interface player {
  id: number
  name: string
  active: boolean
  hearts: number
}

const playerList: player[] = [
  {
    id: 1,
    name: 'Player 1',
    active: false,
    hearts: 1,
  },
  {
    id: 2,
    name: 'Player 2',
    active: false,
    hearts: 1,
  },
  {
    id: 3,
    name: 'Player 3',
    active: false,
    hearts: 1,
  },
  {
    id: 4,
    name: 'Player 4',
    active: false,
    hearts: 1,
  },
  {
    id: 5,
    name: 'Player 5',
    active: false,
    hearts: 1,
  },
  {
    id: 6,
    name: 'Player 6',
    active: true,
    hearts: 1,
  },
  {
    id: 7,
    name: 'Player 7',
    active: false,
    hearts: 1,
  },
  {
    id: 8,
    name: 'Player 8',
    active: false,
    hearts: 1,
  },
]

const GamePage = () => {
  return (
    <>
      {/* Game Section */}
      <div className='grid grid-cols-2 gap-2'>
        {playerList.map((player) => (
          <Player key={player.id} {...player} />
        ))}
      </div>
      {/* Chat Section */}
      <div className='absolute bottom-0 z-20 block left-3/4'>
        <Chat />
      </div>
      {/* Settings Section */}
      <div className='absolute block left-3/4 top-2'>
        <SettingsBar />
      </div>
      {/* Input Bar */}
      <div className='absolute flex justify-center w-screen bottom-8'>
        <input placeholder='type here' className='input'></input>
      </div>
    </>
  )
}

export default GamePage
