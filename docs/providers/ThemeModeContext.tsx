import React from 'react';

// Lightweight external store for theme mode just for the header toggle label.
// Does NOT force a rerender of the whole tree when switching; instead manipulates root element.
// Modes: light -> dark -> auto -> light

type Mode = 'light' | 'dark' | 'auto';

let currentMode: Mode = (() => {
  if (typeof window === 'undefined') return 'auto';
  try {
    const stored = localStorage.getItem('platform-blocks-theme-mode');
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
  } catch {
    console.warn('Failed to access localStorage for theme mode');
  }
  return 'auto';
})();

const listeners = new Set<() => void>();

function applyMode(mode: Mode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  // Clear previous manual classes/attrs
  root.removeAttribute('data-platform-blocks-manual');
  root.classList.remove('platform-blocks-light', 'platform-blocks-dark');
  if (mode === 'light') {
    root.setAttribute('data-platform-blocks-manual', 'light');
    root.classList.add('platform-blocks-light');
  } else if (mode === 'dark') {
    root.setAttribute('data-platform-blocks-manual', 'dark');
    root.classList.add('platform-blocks-dark');
  } // auto -> no manual attribute, allow OS / provider logic
}

function setMode(next: Mode) {
  currentMode = next;
  try { localStorage.setItem('platform-blocks-theme-mode', next); } catch {
    console.warn('Failed to access localStorage for theme mode');
  }
  applyMode(next);
  listeners.forEach(l => l());
}

function cycle() {
  setMode(currentMode === 'light' ? 'dark' : currentMode === 'dark' ? 'auto' : 'light');
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useThemeModeStore(): { mode: Mode; cycle: () => void } {
  const mode = React.useSyncExternalStore(subscribe, () => currentMode, () => 'auto');
  return { mode: mode as Mode, cycle };
}

const ThemeModeContext = React.createContext<{ mode: Mode; cycle: () => void } | null>(null);

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useThemeModeStore();
  // Ensure initial application (on mount only)
  React.useEffect(() => { applyMode(currentMode); }, []);
  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export function useThemeMode() {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
