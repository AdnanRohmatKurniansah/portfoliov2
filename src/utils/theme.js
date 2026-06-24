export const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark'; // default
};

export const getSavedTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  }
  return getSystemTheme();
};

export const applyTheme = (theme) => {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  window.localStorage.setItem('theme', theme);

  // Custom event so other components (like React islands) can react to theme changes
  const event = new CustomEvent('theme-change', { detail: theme });
  window.dispatchEvent(event);
};
