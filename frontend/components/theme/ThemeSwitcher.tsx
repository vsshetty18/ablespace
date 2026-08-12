'use client';

import { useTheme } from './ThemeProvider';

// Placeholder UI: a simple toggle button. If the Figma shows a
// segmented control, dropdown, or icon-based switcher instead, I'll
// swap this markup — the useTheme() logic underneath won't need to change.
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-muted"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
