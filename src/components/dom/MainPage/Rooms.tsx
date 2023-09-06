import { useState } from 'react'
import Room from './Room'

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
