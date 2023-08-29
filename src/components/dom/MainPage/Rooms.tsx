import useStore from '@/helpers/store'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useState } from 'react'

interface room {
  id: string
  name: string
  players: number
  mode: string
  locked: boolean
}

const roomsList: room[] = [
  {
    id: '',
    name: 'Huehu',
    players: 4,
    mode: 'Countries Only',
    locked: true,
  },
  {
    id: '',
    name: 'kuee',
    players: 4,
    mode: 'Countries Only',
    locked: false,
  },
]

const Room = ({ id, name, players, mode, locked }) => {
  //   console.log(id, name, players, locked)

  const [passBox, setPassBox] = useState(false)
  const router = useStore((s) => s.router)

  const togglePassBox = () => {
    setPassBox((passBox) => !passBox)
  }

  return (
    <div className='relative flex flex-col items-center border justify-evenly h-60 rounded-3xl w-44 card'>
      <div className='w-full px-5'>
        <span className='text-2xl font-extrabold text-left'>{name}</span>
      </div>
      <div className='w-full px-5'>
        <span className='text-sm font-light text-left'>
          Players:&nbsp;&nbsp;
        </span>
        <span className='text-base font-bold text-left'>{players}</span>
      </div>
      <div className='px-3 rounded-full secondary-color'>
        <span className='text-base text-left'>{mode}</span>
      </div>
      {locked ? (
        <div className='absolute top-[-15px] right-[24px]'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full primary-color'>
            <LockClosedIcon height={20} />
          </div>
        </div>
      ) : null}

      {!passBox ? (
        <button
          type='button'
          className='w-10/12 py-3 button'
          onClick={() =>
            locked ? togglePassBox() : router.push('/game')
          } /** Link to GamePage */
        >
          Join
        </button>
      ) : (
        <input
          placeholder='Password?'
          autoFocus={true}
          onBlur={() => togglePassBox()} //focus out
          className='w-10/12 input'
        ></input>
      )}
    </div>
  )
}

const Rooms = () => {
  const [search, setSearch] = useState('')

  const filteredList = roomsList.filter((room) => {
    if (room.name.toLowerCase().includes(search.toLowerCase())) {
      return room
    }
    return null
  })
  return (
    <>
      <div className='flex items-center justify-center m-5 gap-10'>
        <input
          placeholder='Search rooms...'
          value={search}
          className='flex h-10 px-6 py-6 input'
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button type='button' className='px-5 button' onClick={() => {}}>
          Create New Room
        </button>
      </div>
      <div className='flex flex-wrap justify-center w-auto m-5 mt-8 gap-5 rounded-3xl'>
        {filteredList.map((props) => {
          return <Room key={props.name} {...props} />
        })}
      </div>
    </>
  )
}

export default Rooms
