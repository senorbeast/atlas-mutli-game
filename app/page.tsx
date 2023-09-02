'use client'

import MainPage from '@/components/dom/MainPage'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Globe = dynamic(() => import('@/components/canvas/globe').then((mod) => mod.Globe), { ssr: false })

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

export default function Page() {
  return (
    <>
      <div className='relative flex flex-col flex-wrap items-center w-full mx-auto md:flex-row'>
        <div className='absolute top-0 left-0 z-0 w-full h-screen'>
          <View className='absolute top-0 z-0 flex flex-col items-center justify-center w-full h-screen'>
            <Suspense fallback={null}>
              <Globe route='/game' position={[0, 0, 0]} scale={0.6} />
              <Common color='' />
            </Suspense>
          </View>
        </div>
        <div className='absolute top-0 left-0 z-10 w-full h-full'>
          <MainPage />
        </div>
      </div>
    </>
  )
}
