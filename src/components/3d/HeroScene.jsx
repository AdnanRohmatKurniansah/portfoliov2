import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function FloatingGeometries({ reducedMotion }) {
  const meshRef1 = useRef(null);
  const meshRef2 = useRef(null);
  const meshRef3 = useRef(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.getElapsedTime();

    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.08;
      meshRef1.current.rotation.y = time * 0.05;
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.x = -time * 0.05;
      meshRef2.current.rotation.z = time * 0.08;
    }
    if (meshRef3.current) {
      meshRef3.current.rotation.y = -time * 0.08;
      meshRef3.current.rotation.z = -time * 0.05;
    }
  });

  return (
    <>
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={0.8} floatIntensity={1} position={[0, 0, 0]}>
        <mesh ref={meshRef1}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.35} />
        </mesh>
      </Float>

      <Float speed={reducedMotion ? 0 : 0.8} rotationIntensity={1.2} floatIntensity={1.5} position={[-2.8, 1.8, -1.5]}>
        <mesh ref={meshRef2}>
          <torusGeometry args={[0.9, 0.15, 8, 24]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.25} />
        </mesh>
      </Float>

      <Float speed={reducedMotion ? 0 : 0.6} rotationIntensity={0.6} floatIntensity={0.8} position={[2.8, -1.8, -1]}>
        <mesh ref={meshRef3}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.25} />
        </mesh>
      </Float>
    </>
  );
}

export default function HeroScene() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (!mounted) return <div className="absolute inset-0 -z-10 bg-transparent" />;

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-80" id="hero-3d-canvas-container">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 6.5], fov: 55 }} dpr={[1, 2]}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <FloatingGeometries reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  );
}
