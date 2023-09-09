import * as THREE from 'three'

export const latLonToVec3 = (lat: number, lon: number): THREE.Vector3 => {
  // Convert latitude and longitude to spherical coordinates
  const phi = lat * (Math.PI / 180)
  const theta = lon * (Math.PI / 180)
  //   // Calculate the Cartesian coordinates
  const x = Math.cos(phi) * Math.sin(theta)
  const y = Math.sin(phi)
  const z = Math.cos(phi) * Math.cos(theta)
  // Create Vectors  the Cartesian coordinates
  return new THREE.Vector3(x, y, z)

  //   return new THREE.Vector3().setFromSpherical(new THREE.Spherical(radius, lat * (Math.PI / 180), lon * (Math.PI / 180)))
}
