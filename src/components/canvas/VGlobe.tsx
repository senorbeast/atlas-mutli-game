import { useEffect, useRef } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import ThreeGlobe from 'three-globe'
import * as THREE from 'three'

extend({ ThreeGlobe })

interface VGlobeProps extends Record<string, unknown> {
  targetCoordinates?: {
    lat: number
    lng: number
  } | null
}

const lerpRadians = (from: number, to: number, factor: number) => {
  const delta = ((((to - from) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  return from + delta * factor
}

export const VGlobe = ({ targetCoordinates, ...props }: VGlobeProps) => {
  // This reference will give us direct access to the ThreeGlobe class

  const globeRef = useRef<ThreeGlobe | null>(null)
  const globeGroupRef = useRef<THREE.Group | null>(null)
  useThree(({ camera }) => {
    camera.position.z = 400
    camera.lookAt(0, 0, 0)
  })

  useFrame((_, delta) => {
    if (!globeGroupRef.current || !targetCoordinates) return

    const targetX = THREE.MathUtils.degToRad(targetCoordinates.lat)
    const targetY = -THREE.MathUtils.degToRad(targetCoordinates.lng)
    const factor = Math.min(1, delta * 2.8)

    globeGroupRef.current.rotation.x = lerpRadians(globeGroupRef.current.rotation.x, targetX, factor)
    globeGroupRef.current.rotation.y = lerpRadians(globeGroupRef.current.rotation.y, targetY, factor)
  })

  useEffect(() => {
    // Configure the globe

    globeRef.current
      ?.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
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
      <group ref={globeGroupRef}>
        {/* @ts-ignore */}
        <threeGlobe {...props} ref={globeRef} />
      </group>
    </>
  )
}
