import React from 'react'
import Shader from './Shader/Shader'

const TryShader = () => {
  
  return (
    <mesh>
        <planeGeometry args={[0.4, 0.6, 16, 16]}/>
        <Shader  />
    </mesh>
  )
}

export default TryShader