import { ChatAlt2Icon } from '@heroicons/react/solid'
import { produceWithPatches } from 'immer'
import { Dispatch, SetStateAction, useState } from 'react'

interface messageType {
  name: string
  message: string
}

const messages: messageType[] = [
  {
    name: 'User',
    message: 'Hello',
  },
  {
    name: 'User2',
    message: 'Hello there',
  },
  {
    name: 'User3',
    message: 'Hello three',
  },
  {
    name: 'User4',
    message: 'LOL',
  },
  {
    name: 'User2',
    message:
      'Some messages can be too long to read, make sure to text-wrap? them? idk google it or maybe use a privacy focused search engine',
  },
  {
    name: 'User4',
    message: 'LMAO',
  },
  {
    name: 'User4',
    message: 'Consecutive Messages',
  },
]

const ChatMessages = () => {
  console.log('Message ')
  return (
    <div className='flex flex-col p-3 overflow-y-auto rounded-xl h-80 primary-color gap-2'>
      {/* Chat Messages Section */}
      {messages.map((item, i) => (
        <div key={i} className='flex justify-start gap-3'>
          <div className='font-extrabold'>{item.name}: </div>
          <div className='font-base'>{item.message}</div>
        </div>
      ))}
    </div>
  )
}

const Chat = () => {
  const [hover, setHover] = useState(false)
  const [input, setInput] = useState(false)

  const toggleHover = () => {
    setHover(!hover)
  }
  return (
    <>
      <button
        type='button'
        className=''
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        <div
          className='relative h-14 rounded-t-2xl primary-color w-80'
          onClick={(e) => {
            setInput(true)
            e.stopPropagation()
          }}
        >
          {input ? (
            <div
              className='flex items-center justify-center p-3 gap-2'
              onBlur={(e) => {
                setInput(false)
                e.stopPropagation()
              }}
            >
              <span>Username</span>
              <input
                autoFocus
                className='border-0  enabled:hover:border-0 ring-0 primary-color'
              ></input>
            </div>
          ) : (
            <div className='flex items-center justify-center p-3'>
              Chat
              <ChatAlt2Icon height={30} />
            </div>
          )}
        </div>
        {/* Chat Messages on Hover */}
        {hover ? (
          <>
            <div className='absolute justify-center h-5 w-80 bottom-12'></div>
            <div className='absolute bottom-16'>
              <ChatMessages />
            </div>
          </>
        ) : null}
      </button>
    </>
  )
}

export default Chat
