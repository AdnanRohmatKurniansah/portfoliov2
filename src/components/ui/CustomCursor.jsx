import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 280, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMqChange);

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (mq.matches || isTouchDevice) return;

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleMouseOver = (e) => {
      const target = e.target;
      // Inside modal overlay — don't override, let browser default show
      if (target.closest('[data-modal]')) {
        setIsHovered(false);
        return;
      }
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      mq.removeEventListener('change', onMqChange);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [visible, mouseX, mouseY]);

  if (reducedMotion || !visible) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-500 pointer-events-none z-[99998]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          borderColor: isHovered ? 'var(--accent-alt)' : 'var(--accent)',
          backgroundColor: isHovered ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0)',
        }}
        transition={{ type: 'tween', duration: 0.2 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-400 pointer-events-none z-[99998]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: isHovered ? 0.5 : 1,
          backgroundColor: isHovered ? 'var(--accent-alt)' : 'var(--accent)',
        }}
        transition={{ type: 'tween', duration: 0.1 }}
      />
    </>
  );
}
