'use client';

import { Moon, Smartphone, Sun } from 'lucide-react';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import '@/styles/ui/ThemeToggle.css';

type Theme = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    // Default to 'light' mode
    root.setAttribute('data-theme', 'light');
  }
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const icons_size = 16;

  useEffect(() => {
    if (theme !== 'system') {
      applyTheme(theme);
    }
  }, [theme]);

  const pick = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    // biome-ignore lint/suspicious/noDocumentCookie: theme persistence requires a cookie for SSR initial render
    document.cookie = `theme=${t};path=/;max-age=31536000;SameSite=Strict`;
  };

  return (
    <div className='theme_toggle_container'>
      <button
        type='button'
        onClick={() => pick('system')}
        className={`icon_btn ${theme === 'system' ? 'active' : ''}`}
        aria-label='System theme'
        aria-pressed={theme === 'system'}
      >
        <Smartphone size={icons_size} className='icon' />
      </button>
      <button
        type='button'
        onClick={() => pick('light')}
        className={`icon_btn ${theme === 'light' ? 'active' : ''}`}
        aria-label='Light theme'
        aria-pressed={theme === 'light'}
      >
        <Sun size={icons_size} className='icon' />
      </button>
      <button
        type='button'
        onClick={() => pick('dark')}
        className={`icon_btn ${theme === 'dark' ? 'active' : ''}`}
        aria-label='Dark theme'
        aria-pressed={theme === 'dark'}
      >
        <Moon size={icons_size} className='icon' />
      </button>
    </div>
  );
}
