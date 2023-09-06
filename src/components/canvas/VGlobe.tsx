import React, { useRef, useLayoutEffect, useEffect } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import ThreeGlobe from 'three-globe'

extend({ ThreeGlobe })

export const VGlobe = (props) => {
  // This reference will give us direct access to the ThreeGlobe class
  const globeRef = useRef(null)
  useThree(({ camera }) => {
    camera.position.z = 350
    camera.lookAt(0, 0, 0)
  })

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    // globeRef.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    globeRef.current.rotation.x = Math.cos(t) * (Math.PI / 8)
    globeRef.current.rotation.z -= delta / 4
  })

  // An effect that runs after three.js elements are created but before render
  useLayoutEffect(() => {
    // Configure the globe
    globeRef.current.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    globeRef.current.bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  }, [])

  // This is a ThreeGlobe object but represented in JSX.
  // Any valid properties of that class are valid props
  //   @ts-ignore
  return <threeGlobe {...props} ref={globeRef} />
}
