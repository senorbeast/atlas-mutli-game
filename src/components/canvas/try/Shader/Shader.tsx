// @ts-nocheck
import * as THREE from 'three'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import vertex from './glsl/shader.vert'
import fragment from './glsl/shader.frag'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const ShaderImpl = shaderMaterial(
  // Uniform (JS <-> GLSL Channel)
  {
    uTime: 0,
    uColor: new THREE.Color(1, 0.0, 0.0),
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  vertex,
  // Fragment Shader
  fragment,
)

extend({ ShaderImpl })

// eslint-disable-next-line react/display-name
const Shader = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef()

   const [image] = useLoader(THREE.TextureLoader, [
    "https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
  ]);

  useImperativeHandle(ref, () => localRef.current)

  useFrame((_, delta) => (localRef.current.uTime += delta))
  return <shaderImpl uTexture={image} ref={localRef} glsl={THREE.GLSL3} {...props} attach='material' />
})

export default Shader
