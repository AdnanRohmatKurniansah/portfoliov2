/**
 * animations.js — FR-019
 * Shared animation presets for Framer Motion and GSAP ScrollTrigger.
 * Import these instead of hardcoding duration/ease values across components.
 */

// ── Framer Motion variants ──────────────────────────────────────────────────

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// ── Viewport config (use with whileInView) ─────────────────────────────────

export const viewportOnce = { once: true, margin: '-80px' };

// ── GSAP ScrollTrigger defaults ────────────────────────────────────────────

export const scrollTriggerDefaults = {
  start: 'top 85%',
  end: 'bottom 20%',
  toggleActions: 'play none none none',
};

// ── Reduced motion safe wrapper ────────────────────────────────────────────

/**
 * Returns animation variants with motion disabled when
 * `prefers-reduced-motion: reduce` is active (FR-019, §6).
 * @param {object} variants
 * @param {boolean} reducedMotion
 */
export function safeVariants(variants, reducedMotion) {
  if (!reducedMotion) return variants;
  // Flatten all states to visible/static — no transforms, instant transitions
  const safe = {};
  for (const key of Object.keys(variants)) {
    safe[key] = { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } };
  }
  return safe;
}
