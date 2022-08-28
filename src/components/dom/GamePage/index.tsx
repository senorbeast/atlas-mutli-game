import useStore from '@/helpers/store'
import Chat from './Chat'
import SettingsBar from './SettingsBar'

// Identify player individually

interface player {
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
    name: 'Player 1',
    active: false,
    hearts: 1,
  },
  {
    id: 3,
    name: 'Player 1',
    active: false,
    hearts: 1,
  },
  {
    id: 4,
    name: 'Player 1',
    active: false,
    hearts: 1,
  },
  {
    id: 5,
    name: 'Player 1',
    active: false,
    hearts: 1,
  },
  {
    id: 6,
    name: 'Player 1',
    active: true,
    hearts: 1,
  },
  {
    id: 7,
    name: 'Player 1',
    active: false,
    hearts: 1,
  },
  {
    id: 8,
    name: 'Player 1',
    active: false,
    hearts: 1,
  },
]

interface ActivePlayerHighlight {
  active: boolean
  name: string
}

const ActivePlayerHighlight = (props: ActivePlayerHighlight) => {
  return (
    <>
      {props.active ? (
        <div className='p-2 rounded-full bg-amber-300 bg-opacity-50'>
          <div className='p-2 rounded-full bg-amber-300 bg-opacity-50'>
            <div className='p-2 rounded-full bg-amber-300 bg-opacity-50'>
              <div className='flex items-center justify-center p-4 bg-purple-600 rounded-full w-28 h-28'>
                <div className='font-bold text-gray-50 text-7xl'>
                  {props.name[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Display Unhighlighted
        <div className='p-6'>
          <div className='flex items-center justify-center p-4 bg-purple-600 rounded-full w-28 h-28'>
            <div className='font-bold text-gray-50 text-7xl'>
              {props.name[0]}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const Player = ({ ...props }: player) => {
  return (
    <div className='flex h-full even:place-self-end odd:place-self-start'>
      {/* <div className='flex h-full bg-green-400 rounded-3xl even:bg-red-500 even:place-self-end odd:bg-blue-500 odd:place-self-start'> */}
      <div className='flex flex-col items-center justify-start gap-2'>
        {/* Highlight Active Player */}
        <ActivePlayerHighlight name={props.name} active={props.active} />
        <span className='flex font-bold text-black'>{props.name}</span>
      </div>
    </div>
  )
}

const GamePage = () => {
  const setRoute = useStore((state) => state.setRoute)
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
