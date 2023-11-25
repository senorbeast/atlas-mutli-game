import React, { useRef } from 'react'
import * as THREE from 'three'
import { CubicBezierLine } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { latLonToVec3 } from '@/helpers/latlonToVec3'

interface Coordinates {
  lat: number
  lon: number
}

interface BezierCurveProps {
  from: Coordinates
  to: Coordinates
  radius: number
}

interface BezierPoints {
  start: THREE.Vector3
  midA: THREE.Vector3
  midB: THREE.Vector3
  end: THREE.Vector3
}

interface ArcProps extends BezierCurveProps {
  color: string
  lineWidth: number
}

const beizerCurvePoints = ({ from, to, radius }: BezierCurveProps): BezierPoints => {
  // Create Vectors from the Cartesian coordinates
  const vecFrom = latLonToVec3(from.lat, from.lon).setLength(radius)
  const vecTo = latLonToVec3(to.lat, to.lon).setLength(radius)

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

  // Adding Height to each Bezier Control Point
  // const smoothDist = map(distance, 0, 10, 10, 50)
  const fixedHeight = map(distance, 0, 200, 0, 50)
  vecMid.setLength(radius + fixedHeight)

  vecFromClone.add(vecMid)
  vecToClone.add(vecMid)

  vecFromClone.setLength(radius + fixedHeight)
  vecToClone.setLength(radius + fixedHeight)

  return { start: vecFrom, midA: vecFromClone, midB: vecToClone, end: vecTo }
}

const GlobeTravelArc = ({ from, to, radius, color, lineWidth }: ArcProps) => {
  const arcRef = useRef<THREE.Group>()
  const lineRef = useRef()

  const { start, midA, midB, end } = beizerCurvePoints({ from, to, radius })

  return (
    <group ref={arcRef}>
      {/* Create the cubic Bezier curve */}
      <CubicBezierLine
        ref={lineRef}
        start={start} // Starting point
        end={end} // Ending point
        midA={midA} // First control point
        midB={midB} // Second control point
        lineWidth={lineWidth} // In pixels (default)
        color={color}
        dashed={false} // Default
      />
    </group>
  )
}

export default GlobeTravelArc

// Utility function to map a value from one range to another
function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}
