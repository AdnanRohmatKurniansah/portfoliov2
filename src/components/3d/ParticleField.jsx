import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Particles({ count, particleSize, reducedMotion, isMobile }) {
  const pointsRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    // Mouse on desktop
    const handleMouseMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) - 0.5;
      pointer.current.y = (e.clientY / window.innerHeight) - 0.5;
    };

    // Touch on mobile — subtle parallax on swipe
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      pointer.current.x = (touch.clientX / window.innerWidth) - 0.5;
      pointer.current.y = (touch.clientY / window.innerHeight) - 0.5;
    };

    if (isMobile) {
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [reducedMotion, isMobile]);

  const positions = useMemo(() => {
    // Mobile: spread particles across a tighter field
    const spread = isMobile ? 10 : 14;
    const depthSpread = isMobile ? 6 : 10;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * depthSpread;
    }
    return pos;
  }, [count, isMobile]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    if (!reducedMotion) {
      pointsRef.current.rotation.y = time * (isMobile ? 0.008 : 0.015);

      // Mobile: less aggressive parallax to avoid feeling jittery
      const strength = isMobile ? 0.25 : 0.6;
      const lerpSpeed = isMobile ? 0.025 : 0.04;

      const targetX = pointer.current.x * strength;
      const targetY = -pointer.current.y * strength;

      pointsRef.current.position.x +=
        (targetX - pointsRef.current.position.x) * lerpSpeed;
      pointsRef.current.position.y +=
        (targetY - pointsRef.current.position.y) * lerpSpeed;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#06b6d4"
        size={particleSize}
        sizeAttenuation
        transparent
        opacity={isMobile ? 0.45 : 0.55}
      />
    </points>
  );
}

export default function ParticleField() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);

    return () => {
      mq.removeEventListener('change', listener);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) return null;

  // Scale down aggressively on mobile for performance
  const count = reducedMotion ? 40 : isMobile ? 80 : 250;
  const particleSize = isMobile ? 0.05 : 0.035;

  // On mobile, reduce dpr to cap GPU load
  const dpr = isMobile ? [1, 1.5] : [1, 2];

  return (
    <div
      className="absolute inset-0 -z-20 pointer-events-none"
      style={{ opacity: isMobile ? 0.45 : 0.6 }}
      id="particle-field-canvas-container"
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, isMobile ? 4 : 5], fov: isMobile ? 70 : 60 }}
          dpr={dpr}
          // Disable frameloop on mobile when tab not visible
          frameloop="always"
        >
          <Particles
            count={count}
            particleSize={particleSize}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
