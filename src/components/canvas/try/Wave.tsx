import * as THREE from 'three'
import React, { useRef } from 'react'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import vertex from './Shader/glsl/shader.vert'
import fragment from './Shader/glsl/shader.frag'

// Define Shader Material
const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(1, 0, 0),
    uTexture: new THREE.Texture(),
  },
  vertex,
  fragment,
)

// Extend Three.js with Custom Shader Material
extend({ WaveShaderMaterial })

// export const Wave = () => {
//   const ref = useRef<any>(null)

//   useFrame(({ clock }) => {
//     if (ref.current) {
//       ref.current.uTime = clock.getElapsedTime()
//     }
//   })

//   const [image] = useLoader(THREE.TextureLoader, [
//     'https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
//   ])

//   return (
//     <mesh>
//       <planeGeometry args={[0.4, 0.6, 16, 16]} />
//       <waveShaderMaterial ref={ref} uColor={'hotpink'} uTexture={image} />
//     </mesh>
//   )
// }
