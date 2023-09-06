'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/Three'

export const Common = ({ color = 'white' }) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    {/* @ts-ignore */}
    <ambientLight intensity={1} />
    {/* @ts-ignore */}
    <pointLight position={[300, 300, 300]} intensity={4} />
    {/* @ts-ignore */}
    <pointLight position={[300, -300, -400]} color='blue' />
    {/* @ts-ignore */}
    <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
  </Suspense>
)

interface ViewProps {
  children: React.ReactNode
  className: string
  orbit?: boolean // You can specify the type for other props as well
  // ... other prop types
}

const View = forwardRef(({ children, orbit, ...props }: ViewProps, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        {/* @ts-ignore */}
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
