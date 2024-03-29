'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import useStore, { setState } from '@/store/store'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

const Layout = ({ children }) => {
  const ref = useRef(null)
  const dark = useStore((state) => state.darkMode)

  return (
    <div
      ref={ref}
      className={`${dark ? 'dark' : ''}`}
      style={{
        position: 'relative',
        width: ' 100%',
        height: '100%',
        overflow: 'auto',
        touchAction: 'auto',
      }}
    >
      {children}
      <Scene
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        eventSource={ref}
        eventPrefix='client'
      />
    </div>
  )
}

export { Layout }
