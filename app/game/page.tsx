'use client'

import GamePage from '@/components/dom/GamePage'
import { latLonToVec3 } from '@/helpers/latlonToVec3'
import useStore from '@/store/store'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const VGlobe = dynamic(() => import('@/components/canvas/VGlobe').then((mod) => mod.VGlobe), { ssr: false })
const Word = dynamic(() => import('@/components/canvas/Word').then((mod) => mod.Word), { ssr: false })
const GlobeTravelArc = dynamic(() => import('@/components/canvas/GlobeTravelArc').then((mod) => mod.default), {
  ssr: false,
})

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex flex-col items-center justify-center w-full h-96'>
      <svg className='w-5 h-5 mr-3 -ml-1 text-black animate-spin' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

function GameRoute() {
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const acceptedCities = useStore((state) => state.acceptedCities)
  const currentCity = useStore((state) => state.currentCity)
  const visibleCityMarkers = acceptedCities.slice(-5)

  return (
    <div className='relative flex w-screen h-screen'>
      <div className='absolute z-10 flex w-screen h-screen pointer-events-none'>
        <GamePage roomId={roomId} />
      </div>
      <View orbit className='absolute top-0 z-0 flex flex-col items-center justify-center w-full h-screen'>
        <VGlobe targetCoordinates={currentCity ? { lat: currentCity.lat, lng: currentCity.lng } : null} />
        {acceptedCities.slice(1).map((city, index) => {
          const previousCity = acceptedCities[index]
          return (
            <GlobeTravelArc
              key={`${previousCity.name}-${city.name}-${city.submittedAt}`}
              color='#22d3ee'
              from={{ lat: previousCity.lat, lon: previousCity.lng }}
              to={{ lat: city.lat, lon: city.lng }}
              radius={100}
              lineWidth={3}
            />
          )
        })}
        {visibleCityMarkers.map((city) => (
          <Word key={`${city.name}-${city.submittedAt}`} position={latLonToVec3(city.lat, city.lng).setLength(105)}>
            {city.name}
          </Word>
        ))}
        <Common />
      </View>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GameRoute />
    </Suspense>
  )
}
