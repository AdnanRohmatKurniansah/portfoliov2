import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const taglines = [
  'Fullstack Developer',
  'Web Architect',
  'Problem Solver',
];

export default function TypewriterTagline() {
  const name = 'Adnan Rohmat Kurniansah';
  const [typedName, setTypedName] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < name.length) {
        setTypedName(name.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTypingComplete(true);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!typingComplete) return;
    const blink = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(blink);
  }, [typingComplete]);

  useEffect(() => {
    if (!typingComplete) return;
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [typingComplete]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="text-sm font-mono-technical text-[var(--accent)] tracking-widest uppercase">
        Hey there 👋
      </span>
      <h1 className="font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08] w-full">
        <span className="block text-[26px] sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl">
          I'm
        </span>
        <span
          className="block text-[26px] sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl break-words hyphens-auto"
        >
          {typedName}
          <span
            aria-hidden="true"
            className="inline-block w-[3px] rounded-sm bg-[var(--accent)] ml-0.5 align-middle"
            style={{
              height: '0.85em',
              opacity: typingComplete ? (showCursor ? 1 : 0) : 1,
              transition: 'opacity 0.1s',
            }}
          />
        </span>
      </h1>

      <div className="h-8 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          {typingComplete && (
            <motion.p
              key={taglineIndex}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg font-semibold gradient-text"
            >
              {taglines[taglineIndex]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
