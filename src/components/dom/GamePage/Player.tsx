import { HeartIcon } from '@heroicons/react/solid'
import type { player } from './index'

const ActivePlayerHighlight = ({ name }: { name: string }) => {
  return (
    <div className='p-2 rounded-full bg-amber-300 bg-opacity-50'>
      <div className='p-2 rounded-full bg-amber-300 bg-opacity-50'>
        <div className='p-2 rounded-full bg-amber-300 bg-opacity-50'>
          <div className='flex items-center justify-center p-4 bg-purple-600 rounded-full w-28 h-28'>
            <div className='font-bold text-gray-50 text-7xl'>{name[0]}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const NormalPlayer = ({ name }: { name: string }) => {
  return (
    <>
      {/* // Display Unhighlighted */}
      <div className='p-6'>
        <div className='flex items-center justify-center p-4 bg-purple-600 rounded-full w-28 h-28'>
          <div className='font-bold text-gray-50 text-7xl'>{name[0]}</div>
        </div>
      </div>
    </>
  )
}

const HeartArray = ({ numHearts, radius }: { numHearts: number; radius: number }) => {
  const heartSpacing = 20 // Adjust this value for the desired spacing between hearts
  const circumference = 2 * Math.PI * radius
  const totalHeartWidth = numHearts * heartSpacing

  const angleBetweenHearts = (totalHeartWidth / circumference) * (2 * Math.PI)

  return (
    <div
      className='relative'
      style={{
        width: `${circumference}px`,
        height: `${totalHeartWidth}px`,
        transformOrigin: 'center top',
        transform: `rotate(${180 - (angleBetweenHearts * 180) / Math.PI}deg)`,
      }}
    >
      {Array.from({ length: numHearts }, (_, index) => {
        const angle = index * angleBetweenHearts
        const x = radius * Math.sin(angle)
        const y = -radius * Math.cos(angle)

        return (
          <HeartIcon
            key={index}
            className='absolute w-6 h-6 text-red-500'
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )
      })}
    </div>
  )
}

export const Player = ({ id, name, active, hearts }: player) => {
  return (
    //  To enable pointer-events for players, add pointer-events-auto to className
    <div className='flex h-full even:place-self-end odd:place-self-start'>
      {/* <div className='flex h-full bg-green-400 rounded-3xl even:bg-red-500 even:place-self-end odd:bg-blue-500 odd:place-self-start'> */}
      <div className='flex flex-col items-center justify-start gap-2'>
        {/* Highlight Active Player */}
        {/* Adjust numHearts and radius as needed */}
        <div>
          {/* <HeartArray numHearts={8} radius={40} /> */}
          {active ? <ActivePlayerHighlight name={name} /> : <NormalPlayer name={name} />}
        </div>
        <span className='flex font-bold text-black'>{name}</span>
      </div>
    </div>
  )
}
