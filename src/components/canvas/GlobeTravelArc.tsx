import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CubicBezierLine, Line } from '@react-three/drei'

interface Coordinates {
  lat: number
  lon: number
}

interface ArcProps {
  from: Coordinates
  to: Coordinates
  radius: number
  divisions: number
  color: string
  lineWidth: number
}

const GlobeTravelArc = ({ from, to, radius, divisions, color, lineWidth }: ArcProps) => {
  const arcRef = useRef<THREE.Group>()

  useFrame(() => {
    if (arcRef.current) {
      // Update the arc here if needed
    }
  })

  // Convert latitude and longitude to spherical coordinates
  const phiFrom = from.lat * (Math.PI / 180)
  const thetaFrom = from.lon * (Math.PI / 180)
  const phiTo = to.lat * (Math.PI / 180)
  const thetaTo = to.lon * (Math.PI / 180)

  // Calculate the Cartesian coordinates of the starting and ending points
  const xFrom = radius * Math.cos(phiFrom) * Math.sin(thetaFrom)
  const yFrom = radius * Math.sin(phiFrom)
  const zFrom = radius * Math.cos(phiFrom) * Math.cos(thetaFrom)

  const xTo = radius * Math.cos(phiTo) * Math.sin(thetaTo)
  const yTo = radius * Math.sin(phiTo)
  const zTo = radius * Math.cos(phiTo) * Math.cos(thetaTo)

  // Create Vectors from the Cartesian coordinates
  const vecFrom = new THREE.Vector3(xFrom, yFrom, zFrom)
  const vecTo = new THREE.Vector3(xTo, yTo, zTo)

  // # Need two additional points to control the Cubic Bezier Curve

  const distance = vecFrom.distanceTo(vecTo)

  const vecFromClone = vecFrom.clone()
  const vecToClone = vecTo.clone()

  // Mid points of the Coordinates
  const xMid = 0.5 * (vecFrom.x + vecTo.x)
  const yMid = 0.5 * (vecFrom.y + vecTo.y)
  const zMid = 0.5 * (vecFrom.z + vecTo.z)

  // Mid Vector
  const vecMid = new THREE.Vector3(xMid, yMid, zMid)

  // const smoothDist = distance
  const smoothDist = map(distance, 0, 10, 0, 10.6 / distance)
  vecMid.setLength(radius * smoothDist)

  vecFromClone.add(vecMid)
  vecToClone.add(vecMid)

  vecFromClone.setLength(radius * smoothDist)
  vecToClone.setLength(radius * smoothDist)

  // Create the cubic Bezier curve
  const curve = new THREE.CubicBezierCurve3(vecFrom, vecFromClone, vecToClone, vecTo)

  // Sample points along the Bezier curve to create the flight path
  // const points = curve.getPoints(divisions)

  return (
    <group ref={arcRef}>
      <CubicBezierLine
        start={vecFrom} // Starting point
        end={vecTo} // Ending point
        midA={vecFromClone} // First control point
        midB={vecToClone} // Second control point
        lineWidth={2} // In pixels (default)
        color='red'
        dashed={false} // Default
        // Optional array of RGB values for each point
      />
    </group>
  )
}

export default GlobeTravelArc

// Utility function to map a value from one range to another
function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
