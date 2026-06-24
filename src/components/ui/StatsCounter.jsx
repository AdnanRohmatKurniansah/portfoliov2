import React, { useEffect, useState, useRef } from 'react';

function StatItem({ end, suffix = '', label }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTs = null;
          const duration = 1400;
          const step = (ts) => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * end));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(end);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <span className="text-3xl md:text-4xl font-extrabold font-mono-technical text-[var(--text-primary)] leading-none">
        {count}
        <span className="text-[var(--primary)]">{suffix}</span>
      </span>
      <span className="text-sm text-[var(--text-primary)]/45 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6 py-8 border-y border-[var(--border)]"
      id="stats-counter-container"
    >
      <StatItem end={1} suffix="+" label="Years Experience" />
      <StatItem end={8} label="Projects Completed" />
      <StatItem end={12} label="Technologies" />
    </div>
  );
}
