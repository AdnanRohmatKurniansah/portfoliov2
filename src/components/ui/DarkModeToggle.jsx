import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSavedTheme, applyTheme } from '../../utils/theme';

export default function DarkModeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set theme on mount from localStorage or system preference
    setTheme(getSavedTheme());
    setMounted(true);

    const handleThemeChange = (e) => {
      setTheme(e.detail);
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <button
        aria-label="Toggle dark mode"
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.08)] light:border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: 15, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -15, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Moon className="w-5 h-5 text-cyan-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 15, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -15, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
