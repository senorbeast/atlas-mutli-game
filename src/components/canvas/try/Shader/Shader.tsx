// @ts-nocheck
import * as THREE from 'three'
import { ShaderMaterialProps, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import vertex from './glsl/shader.vert'
import fragment from './glsl/shader.frag'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const BackgroundShader = shaderMaterial(
  // ShaderIm2plUniform (JS <-> GLSL Channel)
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

extend({ BackgroundShader })

interface  BackgroundShaderProps{
    uTime:number
    uColor:THREE.Color
    uTexture:THREE.Texture
}

export const BackgroundShaderMaterial = forwardRef<React.MutableRefObject<any>, BackgroundShaderProps>(({ children, ...props }, ref) => {
  const localRef = useRef()

  // Modifies parentRef as per localRef (child)
  useImperativeHandle(ref, () => localRef.current)

  return <backgroundShader ref={localRef} glsl={THREE.GLSL3} {...props} attach='material'/>
})

