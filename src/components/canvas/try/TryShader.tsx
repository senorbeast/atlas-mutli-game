import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { BackgroundShaderMaterial } from './Shader/Shader';

const TryShader = () => {
  const ref = useRef(null)

  useFrame((_, delta) => (ref.current.uTime += delta))

   const [image] = useLoader(THREE.TextureLoader, [
    "https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
  ]);


  
  return (
    <mesh>
        <planeGeometry args={[4, 6, 32, 32]} />
        <BackgroundShaderMaterial ref={ref} uTexture={image} uColor={new THREE.Color(1, 0.0, 0.0)}  uTime={0}  />
    </mesh>
  )
}

export default TryShader