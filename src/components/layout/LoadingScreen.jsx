import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_MESSAGES = [
  'Initializing environment...',
  'Loading assets...',
  'Compiling shaders...',
  'Connecting to server...',
  'Rendering world...',
  'Almost ready...',
];

const RingDecor = ({ size, dashArray, speed, delay, opacity, color, reverse = false }) => (
  <motion.svg
    width={size} height={size}
    viewBox={`0 0 ${size} ${size}`}
    className="absolute pointer-events-none"
    aria-hidden="true"
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration: speed, repeat: Infinity, ease: 'linear', delay }}
    style={{ opacity }}
  >
    <circle
      cx={size / 2} cy={size / 2} r={size / 2 - 2}
      fill="none"
      stroke={color}
      strokeWidth="1"
      strokeDasharray={dashArray}
    />
  </motion.svg>
);

const CornerSquare = ({ pos, size = 10 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      width: size, height: size,
      border: '1px solid var(--accent)',
      ...pos,
    }}
    animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.1, 1] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    aria-hidden="true"
  />
);

// Floating diamond
const Diamond = ({ style, size = 8, color, delay = 0 }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{
      width: size, height: size,
      background: color,
      transform: 'rotate(45deg)',
      ...style,
    }}
    animate={{ opacity: [0.3, 0.8, 0.3], y: [0, -6, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
    aria-hidden="true"
  />
);

const TickerLine = ({ y, isDark }) => (
  <motion.div
    className="absolute left-0 right-0 pointer-events-none"
    style={{
      height: 1,
      top: y,
      background: `linear-gradient(90deg, transparent 0%, ${isDark ? 'rgba(6,182,212,0.25)' : 'rgba(8,145,178,0.2)'} 40%, ${isDark ? 'rgba(168,85,247,0.15)' : 'rgba(124,58,237,0.15)'} 70%, transparent 100%)`,
    }}
    animate={{ scaleX: [0, 1], opacity: [0, 0.6, 0] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: Math.random() * 1.5 }}
    aria-hidden="true"
  />
);

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [theme, setTheme] = useState('dark');
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(t);
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const DURATION = 2200;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const raw = Math.min((ts - startRef.current) / DURATION, 1);
      const eased = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const pct = Math.floor(eased * 100);
      setProgress(pct);
      setMsgIndex(Math.min(Math.floor(eased * BOOT_MESSAGES.length), BOOT_MESSAGES.length - 1));
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setTimeout(() => setLoading(false), 350);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    const skip = () => setLoading(false);
    window.addEventListener('keydown', skip);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      obs.disconnect();
      window.removeEventListener('keydown', skip);
    };
  }, []);

  const isDark = theme === 'dark';
  const bg = isDark ? '#0a0a0f' : '#f0f4ff';
  const fg = isDark ? '#e2e8f0' : '#0f172a';
  const accent = isDark ? 'rgba(6,182,212,' : 'rgba(8,145,178,';
  const accentAlt = isDark ? 'rgba(168,85,247,' : 'rgba(124,58,237,';

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeIn' } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{ backgroundColor: bg }}
        >

          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${isDark ? 'rgba(255,255,255,0.012)' : 'rgba(0,0,0,0.018)'} 2px, ${isDark ? 'rgba(255,255,255,0.012)' : 'rgba(0,0,0,0.018)'} 4px)`,
            }}
            aria-hidden="true"
          />

          <motion.div
            className="absolute left-0 right-0 h-32 pointer-events-none z-[1]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${accent}0.03), transparent)`,
            }}
            animate={{ top: ['-15%', '115%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />

          <div className="absolute pointer-events-none z-[1]"
            style={{ inset: 0, background: `radial-gradient(ellipse 50% 40% at 15% 50%, ${accent}0.07) 0%, transparent 100%)` }}
            aria-hidden="true" />
          <div className="absolute pointer-events-none z-[1]"
            style={{ inset: 0, background: `radial-gradient(ellipse 40% 35% at 85% 55%, ${accentAlt}0.06) 0%, transparent 100%)` }}
            aria-hidden="true" />

          <TickerLine y="22%" isDark={isDark} />
          <TickerLine y="78%" isDark={isDark} />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]" aria-hidden="true">
            <RingDecor size={520} dashArray="4 8"   speed={28} delay={0}   opacity={0.07} color={`${accent}1)`} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]" aria-hidden="true">
            <RingDecor size={420} dashArray="2 12"  speed={20} delay={0.5} opacity={0.1}  color={`${accent}1)`} reverse />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]" aria-hidden="true">
            <RingDecor size={320} dashArray="6 6"   speed={16} delay={0}   opacity={0.12} color={`${accentAlt}1)`} />
          </div>

          <motion.svg
            className="absolute top-0 right-0 pointer-events-none z-[2]"
            width="260" height="260" viewBox="0 0 260 260"
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <path
              d="M 200 10 A 190 190 0 0 1 250 150"
              fill="none"
              stroke={`${accent}0.2)`}
              strokeWidth="1"
              strokeDasharray="3 9"
            />
          </motion.svg>

          <motion.svg
            className="absolute bottom-0 left-0 pointer-events-none z-[2]"
            width="260" height="260" viewBox="0 0 260 260"
            aria-hidden="true"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          >
            <path
              d="M 60 250 A 190 190 0 0 1 10 110"
              fill="none"
              stroke={`${accentAlt}0.18)`}
              strokeWidth="1"
              strokeDasharray="2 8"
            />
          </motion.svg>

          {[
            { cls: 'top-5 left-5',      border: 'border-t-2 border-l-2' },
            { cls: 'top-5 right-5',     border: 'border-t-2 border-r-2' },
            { cls: 'bottom-5 left-5',   border: 'border-b-2 border-l-2' },
            { cls: 'bottom-5 right-5',  border: 'border-b-2 border-r-2' },
          ].map(({ cls, border }, i) => (
            <motion.div
              key={i}
              className={`absolute w-10 h-10 pointer-events-none z-[3] ${cls} ${border}`}
              style={{ borderColor: 'var(--accent)' }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              aria-hidden="true"
            />
          ))}

          <CornerSquare pos={{ top: '18%', left: '8%' }}  size={6} />
          <CornerSquare pos={{ top: '72%', left: '6%' }}  size={4} />
          <CornerSquare pos={{ top: '24%', right: '7%' }} size={5} />
          <CornerSquare pos={{ top: '68%', right: '9%' }} size={7} />
          <CornerSquare pos={{ top: '45%', left: '4%' }}  size={3} />
          <CornerSquare pos={{ top: '50%', right: '5%' }} size={4} />

          <Diamond style={{ top: '14%', left: '12%' }}  size={7} color={`${accent}0.5)`}    delay={0} />
          <Diamond style={{ top: '80%', left: '15%' }}  size={5} color={`${accentAlt}0.45)`} delay={0.7} />
          <Diamond style={{ top: '20%', right: '13%' }} size={6} color={`${accentAlt}0.4)`}  delay={1.1} />
          <Diamond style={{ top: '75%', right: '12%' }} size={8} color={`${accent}0.35)`}    delay={0.4} />
          <Diamond style={{ top: '38%', left: '6%' }}   size={4} color={`${accent}0.3)`}     delay={1.5} />
          <Diamond style={{ top: '60%', right: '7%' }}  size={5} color={`${accentAlt}0.35)`} delay={0.9} />

          {[{ left: '7%', top: '50%' }, { right: '6%', top: '48%' }].map((pos, i) => (
            <motion.svg
              key={`cross-${i}`}
              className="absolute pointer-events-none z-[3]"
              width="16" height="16" viewBox="0 0 16 16"
              style={pos}
              animate={{ opacity: [0.3, 0.8, 0.3], rotate: [0, 90, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              aria-hidden="true"
            >
              <line x1="8" y1="0" x2="8" y2="16" stroke={`${accent}1)`} strokeWidth="1" />
              <line x1="0" y1="8" x2="16" y2="8" stroke={`${accent}1)`} strokeWidth="1" />
              <circle cx="8" cy="8" r="2" fill="none" stroke={`${accent}1)`} strokeWidth="1" />
            </motion.svg>
          ))}
          {[
            { pos: { top: '10%', left: '20%' }, size: 28, delay: 0.3 },
            { pos: { bottom: '12%', right: '18%' }, size: 22, delay: 0.8 },
            { pos: { top: '60%', left: '18%' }, size: 18, delay: 1.2 },
            { pos: { top: '30%', right: '20%' }, size: 24, delay: 0.5 },
          ].map(({ pos, size, delay }, i) => {
            const hw = size / 2;
            const pts = [
              [hw, 0], [size, hw * 0.5], [size, hw * 1.5],
              [hw, size], [0, hw * 1.5], [0, hw * 0.5],
            ].map(([x, y]) => `${x},${y}`).join(' ');
            return (
              <motion.svg
                key={`hex-${i}`}
                className="absolute pointer-events-none z-[3]"
                width={size} height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={pos}
                animate={{ opacity: [0.15, 0.45, 0.15], rotate: [0, 60, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay }}
                aria-hidden="true"
              >
                <polygon
                  points={pts}
                  fill="none"
                  stroke={i % 2 === 0 ? `${accent}1)` : `${accentAlt}1)`}
                  strokeWidth="1"
                />
              </motion.svg>
            );
          })}

          <div className="relative z-[10] flex flex-col items-center gap-8 w-full max-w-xs px-8">
            <div className="relative flex items-end gap-1.5">
              <span
                className="font-mono-technical font-black leading-none tabular-nums"
                style={{
                  fontSize: 'clamp(1rem, 20vw, 3rem)',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-alt))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {progress}
              </span>
              <span
                className="font-mono-technical font-bold"
                style={{
                  fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                  marginBottom: 'clamp(0.5rem, 2vw, 1.25rem)',
                  color: 'var(--text-primary)',
                  opacity: 0.35,
                }}
              >
                %
              </span>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <div className="flex gap-[3px]" aria-hidden="true">
                {Array.from({ length: 20 }).map((_, i) => {
                  const filled = i < Math.floor(progress / 5);
                  const partial = i === Math.floor(progress / 5);
                  const pct = (progress % 5) / 5;
                  return (
                    <div
                      key={i}
                      className="h-[7px] flex-1 rounded-[2px] overflow-hidden"
                      style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)' }}
                    >
                      {(filled || partial) && (
                        <div
                          className="h-full transition-none"
                          style={{
                            width: filled ? '100%' : `${pct * 100}%`,
                            background: `linear-gradient(
                              90deg,
                              var(--accent) 0%,
                              var(--accent-alt) 50%,
                              var(--accent) 100%
                            )`,
                            backgroundSize: '200% 100%',
                            animation: 'rotate-gradient 3s linear infinite',
                            boxShadow: filled
                              ? '0 0 12px var(--accent), 0 0 20px var(--accent-alt)'
                              : 'none',
                            opacity: filled ? 1 : 0.75,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-4">
                <motion.span
                  key={msgIndex}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono-technical text-[11px] tracking-wider truncate"
                  style={{ color: `${fg}55` }}
                >
                  {BOOT_MESSAGES[msgIndex]}
                </motion.span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="font-mono-technical text-xs flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-alt))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                  aria-hidden="true"
                >
                  ▋
                </motion.span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-[10px] font-mono-technical tracking-[0.18em] uppercase"
              style={{ color: `${fg}22` }}>
              Press any key to skip
            </motion.p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
