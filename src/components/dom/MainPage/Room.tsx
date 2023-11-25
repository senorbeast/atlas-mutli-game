import { LockClosedIcon } from '@heroicons/react/24/solid'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Room = ({ id, name, players, mode, locked }) => {
  //   console.log(id, name, players, locked)

  const [passBox, setPassBox] = useState(false)
  const router = useRouter()

  const togglePassBox = () => {
    setPassBox((passBox) => !passBox)
  }

  return (
    <div className='relative flex flex-col items-center border justify-evenly h-60 rounded-3xl w-44 card '>
      <div className='w-full px-5'>
        <span className='text-2xl font-extrabold text-left'>{name}</span>
      </div>
      <div className='w-full px-5'>
        <span className='text-sm font-light text-left'>Players:&nbsp;&nbsp;</span>
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
          onClick={() => (locked ? togglePassBox() : router.push('/game'))} /** Link to GamePage */
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
export default Room
