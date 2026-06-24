import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="interactive fixed bottom-8 right-8 z-[9000] w-13 h-13 flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/80 backdrop-blur-md text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 shadow-lg"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
