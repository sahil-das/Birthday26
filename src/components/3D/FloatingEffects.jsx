import { useMemo } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

export default function FloatingEffects({ count = 80 }) {
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.25, 0.25);
    shape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    shape.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
    shape.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
    shape.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
    shape.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
    shape.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
    return shape;
  }, []);

  const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };

  const objects = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      type: Math.floor(Math.random() * 3),
      position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() * 50) - 15],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.5 + Math.random() * 0.8,
      speed: 0.5 + Math.random() * 2,
    }));
  }, [count]);

  return (
    <group>
      {objects.map((obj) => (
        <Float key={obj.id} speed={obj.speed} rotationIntensity={obj.type === 0 ? 0.2 : 1.5} floatIntensity={2}>
          <mesh position={obj.position} rotation={obj.rotation} scale={obj.scale}>
            {obj.type === 0 && (
              <>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshPhysicalMaterial color="#ff1493" transmission={0.8} roughness={0.1} thickness={1} clearcoat={1} />
              </>
            )}
            {obj.type === 1 && (
              <>
                <octahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={4} toneMapped={false} />
              </>
            )}
            {obj.type === 2 && (
              <group scale={0.8} rotation={[0, 0, Math.PI]}>
                <mesh>
                  <extrudeGeometry args={[heartShape, extrudeSettings]} />
                  <meshStandardMaterial color="#ff69b4" emissive="#ff1493" emissiveIntensity={2} toneMapped={false} />
                </mesh>
              </group>
            )}
          </mesh>
        </Float>
      ))}
    </group>
  );
}