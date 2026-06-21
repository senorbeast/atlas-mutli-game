'use client'

import { UserIcon } from '@heroicons/react/24/solid'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useStore from '@/store/store'

const PLAYER_NAME_STORAGE_KEY = 'atlas.playerName'

interface JoinRoomGateProps {
  roomId: string
}

export function JoinRoomGate({ roomId }: JoinRoomGateProps) {
  const displayName = useStore((state) => state.displayName)
  const setDisplayName = useStore((state) => state.setDisplayName)
  const [draftName, setDraftName] = useState('')

  useEffect(() => {
    if (displayName) return
    const storedName = window.localStorage.getItem(PLAYER_NAME_STORAGE_KEY)?.trim()
    if (!storedName) return
    setDisplayName(storedName)
  }, [displayName, setDisplayName])

  if (displayName) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = draftName.trim().replace(/\s+/g, ' ')
    if (!name) {
      toast.error('Enter a name before joining')
      return
    }

    window.localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name)
    setDisplayName(name)
    toast.success(`Joining room ${roomId} as ${name}`)
  }

  return (
    <div className='absolute inset-0 z-40 flex items-center justify-center pointer-events-auto bg-slate-950/70 px-4 backdrop-blur-sm'>
      <form
        className='w-full max-w-sm rounded-lg border border-white/20 bg-white p-5 text-slate-950 shadow-2xl'
        onSubmit={handleSubmit}
      >
        <div className='mb-4 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700'>
            <UserIcon className='h-5 w-5' />
          </div>
          <div>
            <div className='text-sm font-semibold uppercase text-slate-500'>Room {roomId}</div>
            <h1 className='text-xl font-bold'>Enter your name</h1>
          </div>
        </div>
        <input
          autoFocus
          className='input w-full rounded-lg'
          maxLength={32}
          placeholder='Player name'
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
        />
        <button type='submit' className='button mt-4 w-full rounded-lg'>
          Join Room
        </button>
      </form>
    </div>
  )
}
