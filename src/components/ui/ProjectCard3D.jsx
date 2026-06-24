import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard3D({ project, onClick }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = -((e.clientY - rect.top - rect.height / 2) / rect.height) * 7;
    const y = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 7;
    setTilt({ x, y });
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 900 }}
      className="w-full h-full cursor-pointer"
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: hovered ? 1.015 : 1,
          boxShadow: hovered
            ? '0 24px 60px rgba(0,0,0,0.32), 0 0 0 1px rgba(6,182,212,0.18)'
            : '0 2px 12px rgba(0,0,0,0.12), 0 0 0 1px var(--border)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full flex flex-col rounded-2xl bg-[var(--card)] overflow-hidden"
      >
        <div
          className="relative w-full overflow-hidden flex-shrink-0"
          style={{ height: '200px', transform: 'translateZ(6px)' }}
        >
          <img
            src={project.img}
            alt={project.title}
            className="w-full h-full object-cover object-top transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
            loading="lazy"
          />

          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
              opacity: hovered ? 1 : 0.5,
            }}
          />

          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--bg-primary)]/85 backdrop-blur-sm border border-[var(--border)] text-sm font-medium text-[var(--text-primary)] shadow-lg">
              View details
              <ArrowUpRight size={12} strokeWidth={2.5} />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5 flex-grow"
          style={{ transform: 'translateZ(10px)' }}
        >
          <div className="flex flex-col gap-1.5">
            <h3
              className="text-base font-semibold leading-snug transition-colors duration-200"
              style={{ color: hovered ? 'var(--accent)' : 'var(--text-primary)' }}
            >
              {project.title}
            </h3>
            <p className="text-sm text-[var(--text-primary)]/50 line-clamp-2 leading-relaxed">
              {project.desc}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {project.tags.slice(0, 4).map((tag, i) => (
              <span key={`${project.title}-tag-${i}`} class="text-xs font-mono-technical px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-primary)]/55 bg-[var(--bg-surface)]/50">
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-[10px] font-mono-technical px-1.5 py-0.5 rounded-md border border-[var(--border)] text-[var(--text-primary)]/35">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
