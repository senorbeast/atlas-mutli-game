import React, { useRef, useEffect } from 'react'
import { extend, useThree } from '@react-three/fiber'
import ThreeGlobe from 'three-globe'

extend({ ThreeGlobe })

export const VGlobe = (props) => {
  // This reference will give us direct access to the ThreeGlobe class

  const globeRef = useRef(null)
  useThree(({ camera }) => {
    camera.position.z = 400
    camera.lookAt(0, 0, 0)
  })

  useEffect(() => {
    // Configure the globe

    globeRef.current
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .arcColor('color')

    // globeRef.current.rotation.y += 45
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
