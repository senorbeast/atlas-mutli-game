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
  useEffect(() => {
    // Gen random data
    const N = 20
    const arcsData = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
    }))

    // Configure the globe
    globeRef.current
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .arcsData(arcsData)
      .arcColor('color')
      .arcDashLength(0.4)
      .arcDashGap(4)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(1000)

    const CLOUDS_IMG_URL = './clouds.png' // from https://github.com/turban/webgl-earth
  }, [])

  // This is a ThreeGlobe object but represented in JSX.
  // Any valid properties of that class are valid props
  return (
    <>
      <mesh>
        {/* <sphereGeometry args={[300, 32, 16]}></sphereGeometry> */}
        {/* <meshPhongMaterial args={op}></meshPhongMaterial> */}
      </mesh>
      {/* @ts-ignore */}
      <threeGlobe {...props} ref={globeRef} />
    </>
  )
}
