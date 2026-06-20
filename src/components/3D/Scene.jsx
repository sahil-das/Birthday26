import { Environment, Float, Sparkles, useScroll, Text, PresentationControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing'; 

const Flame = ({ position }) => {
  const flameRef = useRef(null);
  useFrame(({ clock }) => {
    if (!flameRef.current) return;
    const t = clock.getElapsedTime();
    flameRef.current.scale.y = 1 + Math.sin(t * 25) * 0.1 + Math.sin(t * 15) * 0.05;
    flameRef.current.scale.x = 1 + Math.sin(t * 20) * 0.05;
    flameRef.current.scale.z = 1 + Math.sin(t * 20) * 0.05;
  });
  return (
    <group position={position}>
      <mesh ref={flameRef} position={[0, 0.15, 0]}>
        <coneGeometry args={[0.06, 0.3, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffdd00" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <pointLight intensity={1.5} distance={3} color="#ffaa00" />
    </group>
  );
};

const ElegantCandle = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.08, 0.08, 0.8, 32]} /><meshStandardMaterial color="#fff5f5" roughness={0.3} metalness={0.1} /></mesh>
      <mesh position={[0, 0.82, 0]}><cylinderGeometry args={[0.01, 0.01, 0.06, 8]} /><meshBasicMaterial color="#333333" /></mesh>
      <Flame position={[0, 0.85, 0]} />
    </group>
  );
};

const CurvedText = ({ text, radius, position }) => {
  const letters = text.split("");
  const arc = Math.PI / 2.2; 
  
  return (
    <group position={position}>
      {letters.map((char, i) => {
        let angle = -arc / 2 + (i / (letters.length - 1)) * arc;
        
        if (char === "K" || char === "k") {
          angle -= 0.15; 
        }

        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <Text 
            key={i} 
            position={[x, 0, z]} 
            rotation={[0, angle, 0]} 
            fontSize={0.65} 
            anchorX="center" 
            anchorY="middle" 
            font="/GreatVibes-Regular.ttf" 
            outlineWidth={0.02} 
            outlineColor="#3b0764"
          >
            {char}
            <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={2} metalness={1} roughness={0.1} toneMapped={false} />
          </Text>
        );
      })}
    </group>
  );
};

const OrbitingDiamonds = ({ scrollData }) => {
  const ringRef = useRef(null);
  useFrame((_, delta) => {
    if (ringRef.current) {
      const targetRotation = -(scrollData.offset * Math.PI * 6);
      ringRef.current.rotation.y = THREE.MathUtils.lerp(ringRef.current.rotation.y, targetRotation, delta * 3);
    }
  });
  
  const diamonds = useMemo(() => Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { id: i, position: [Math.cos(angle) * 2.4, Math.sin(angle * 2) * 0.2, Math.sin(angle) * 2.4], rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] };
  }), []);
  
  return (
    <group ref={ringRef} position={[0, 1.5, 0]}>
      {diamonds.map((d) => (
        <mesh key={d.id} position={d.position} rotation={d.rotation}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export default function Scene({ started }) {
  const scrollPositionRef = useRef(null); 
  const cakeSpinRef = useRef(null);
  const introGroupRef = useRef(null); 
  const tunnelRef = useRef(null);
  const directionalLightRef = useRef(null);
  
  const spinTimer = useRef(0);
  
  const scrollData = useScroll();
  const { viewport } = useThree();

  const isMobile = viewport.width < 5;
  
  // THE FIX: Cake scaled down globally. Reduced from 0.75 down to 0.60 for mobile!
  const responsiveScale = isMobile ? Math.min(0.60, viewport.width / 8) : 0.85;

  useFrame((state, delta) => {
    let targetZ, targetY;

    if (!started) {
      targetZ = 35;
      targetY = 10;
      if (introGroupRef.current) introGroupRef.current.scale.set(0, 0, 0); 
    } else {
      
      spinTimer.current += delta;
      
      const scroll = scrollData.offset;
      const baseZ = isMobile ? 11 : 8; 
      targetZ = baseZ - (scroll * 4); 
      targetY = 1.5 + (scroll * 1.5);
      
      if (started && directionalLightRef.current) {
        const themeWarpProgress = Math.min(1, Math.max(0, (scroll - 0.3) * 2)); 
        directionalLightRef.current.color.lerp(new THREE.Color(themeWarpProgress > 0.5 ? "#fca5a5" : "#c084fc"), delta * 2);
        directionalLightRef.current.intensity = THREE.MathUtils.lerp(1.5, themeWarpProgress > 0.8 ? 2.5 : 1.5, delta * 2);
      }

      if (introGroupRef.current) {
        let currentScale = 1;
        let flyUpY = 0;
        if (scroll > 0.4) {
          const escapeProgress = Math.min(1, (scroll - 0.4) / 0.3);
          currentScale = 1 - escapeProgress;
          flyUpY = escapeProgress * 10;
        }
        if (scroll < 0.1 && introGroupRef.current.scale.x < 0.99) {
           currentScale = THREE.MathUtils.lerp(introGroupRef.current.scale.x, 1, delta * 3);
        }
        introGroupRef.current.scale.set(currentScale, currentScale, currentScale);
        introGroupRef.current.position.y = flyUpY;
      }

      if (scrollPositionRef.current) {
        scrollPositionRef.current.position.y = THREE.MathUtils.lerp(scrollPositionRef.current.position.y, -1.5 - (scroll * 2), delta * 3);
      }
      
      if (cakeSpinRef.current) {
        const autoSpin = spinTimer.current * 0.15; 
        const scrollSpin = scroll * Math.PI * 4; 
        
        cakeSpinRef.current.rotation.y = THREE.MathUtils.lerp(
          cakeSpinRef.current.rotation.y, 
          autoSpin + scrollSpin, 
          delta * 3
        );
      }
    }

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 2);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 2);
    state.camera.lookAt(0, 0.5, 0);

    if (tunnelRef.current) tunnelRef.current.rotation.z += delta * 0.05; 
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight ref={directionalLightRef} position={[5, 8, 3]} intensity={1.5} color="#c084fc" />
      <Environment preset="night" />

      <group ref={tunnelRef}>
        <Sparkles count={400} scale={30} size={1.2} speed={0.1} opacity={0.4} color="#ffffff" />
      </group>

      <group scale={responsiveScale}>
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.3}>
          <group ref={scrollPositionRef} position={[0, -1.5, 0]}>
            
            <OrbitingDiamonds scrollData={scrollData} />

            <group ref={introGroupRef}>
              <group ref={cakeSpinRef}>
                <PresentationControls global={false} cursor={true} snap={false} speed={2} polar={[0, Math.PI / 6]} azimuth={[-Infinity, Infinity]}>
                  
                  <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[2.5, 2.5, 4, 32]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>

                  <group position={[0, -0.6, 0]}>
                    <mesh position={[0, 0, 0]}><cylinderGeometry args={[1.5, 1.8, 0.2, 64]} /><meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} /></mesh>
                    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.5, 0.5, 0.6, 32]} /><meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} /></mesh>
                    <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[2.2, 2.2, 0.1, 64]} /><meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} /></mesh>
                  </group>

                  <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[1.8, 1.8, 1.2, 64]} /><meshPhysicalMaterial color="#fffdd0" roughness={0.3} clearcoat={0.5} /></mesh>
                  <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.8, 0.08, 16, 64]} /><meshStandardMaterial color="#ffb6c1" roughness={0.4} /> </mesh>

                  <mesh position={[0, 1.9, 0]}><cylinderGeometry args={[1.3, 1.3, 1, 64]} /><meshPhysicalMaterial color="#fffdd0" roughness={0.3} clearcoat={0.5} /></mesh>
                  <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.3, 0.06, 16, 64]} /><meshStandardMaterial color="#ffd700" metalness={0.6} roughness={0.2} /></mesh>

                  <mesh position={[0, 2.8, 0]}><cylinderGeometry args={[0.9, 0.9, 0.8, 64]} /><meshPhysicalMaterial color="#fffdd0" roughness={0.3} clearcoat={0.5} /></mesh>
                  <mesh position={[0, 2.4, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.9, 0.05, 16, 64]} /><meshStandardMaterial color="#ffb6c1" roughness={0.4} /></mesh>

                  <CurvedText position={[0, 1.9, 0]} radius={1.32} text="Khushi" />

                  <ElegantCandle position={[0, 3.25, 0.4]} rotation={[0.02, 0, 0]} />
                  <ElegantCandle position={[-0.3, 3.25, -0.15]} rotation={[0, 0, -0.02]} />
                  <ElegantCandle position={[0.3, 3.25, -0.15]} rotation={[0, 0, 0.02]} />
                  
                </PresentationControls>
              </group>
            </group>
          </group>
        </Float>
      </group>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={1.5} />
      </EffectComposer>
    </>
  );
}