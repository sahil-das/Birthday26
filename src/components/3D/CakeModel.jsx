import React from 'react'

// Placeholder CakeModel component. Replace with a glTF-loaded model (use @react-three/drei's useGLTF)
export default function CakeModel(props) {
  return (
    <mesh position={[0, 0, 0]} {...props}>
      <cylinderGeometry args={[1.5, 1.5, 0.7, 32]} />
      <meshStandardMaterial color="#ff7ab6" roughness={0.4} />
    </mesh>
  )
}
