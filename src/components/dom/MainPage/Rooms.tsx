import useStore, { setState } from '@/helpers/store'
import { LockClosedIcon } from '@heroicons/react/solid'
import { useState } from 'react'

interface room {
  id: string
  name: string
  players: number
  locked: boolean
}

const roomsList: room[] = [
  {
    id: '',
    name: 'Huehu',
    players: 4,
    locked: true,
  },
  {
    id: '',
    name: 'tui',
    players: 4,
    locked: true,
  },
  {
    id: '',
    name: 'phewww',
    players: 4,
    locked: true,
  },
  {
    id: '',
    name: 'kuee',
    players: 4,
    locked: false,
  },
]

const Room = ({ id, name, players, locked }) => {
  //   console.log(id, name, players, locked)

  const [passBox, setPassBox] = useState(false)
  const router = useStore((s) => s.router)

  const togglePassBox = () => {
    setPassBox((passBox) => !passBox)
  }

  return (
    <div className='flex flex-col items-center justify-around border h-60 rounded-3xl w-44 card'>
      <div className='flex'>
        name:{'  '}
        <span>{name}</span>
      </div>
      <div className='flex'>{players}</div>
      <div className='flex'>
        {locked ? <LockClosedIcon height={20} /> : null}
      </div>

      {!passBox ? (
        <button
          type='button'
          className='w-10/12 button'
          onClick={() =>
            locked ? togglePassBox() : router.push('/box')
          } /** Link to GamePage */
        >
          Join
        </button>
      ) : (
        <input
          placeholder='Password?'
          autoFocus={true}
          onBlur={() => togglePassBox()} //focus out
          className='w-10/12 px-5 py-3 text-base rounded-full standard-color'
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
      <div className='flex items-center justify-center m-5'>
        <input
          placeholder='Search rooms...'
          value={search}
          className='flex h-10 px-6 border rounded-full standard-color'
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </div>
      <div className='flex flex-wrap justify-center w-auto m-5 gap-5 rounded-3xl'>
        {filteredList.map((props) => {
          return <Room key={props.name} {...props} />
        })}
      </div>
    </>
  )
}

export default Rooms
