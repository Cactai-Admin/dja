'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { PALETTES } from '@/lib/theme/palettes';
import { applyTheme } from '@/lib/theme/apply-theme';
import type { ThemeMode, ThemePaletteId } from '@/lib/theme/theme-types';

export { PALETTES };
export type ThemePalette = ThemePaletteId;
export { type ThemeMode };

interface ThemeContextValue {
  palette: ThemePalette;
  mode: ThemeMode;
  setPalette: (p: ThemePalette) => void;
  setMode: (m: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  palette: 'mono',
  mode: 'light',
  setPalette: () => {},
  setMode: () => {},
  toggleMode: () => {},
});

const STORAGE_PALETTE = 'dja-palette';
const STORAGE_MODE = 'dja-mode';
const STORAGE_DARK_PALETTE = 'dja-dark-palette';

const VALID_DARK_PALETTES: ThemePalette[] = ['mono', 'volt-green', 'volt-red', 'volt-blue'];

function isValidDarkPalette(value: string | null): value is ThemePalette {
  return value !== null && VALID_DARK_PALETTES.includes(value as ThemePalette);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<ThemePalette>('mono');
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rawMode = localStorage.getItem(STORAGE_MODE) as ThemeMode | null;
    const rawPalette = localStorage.getItem(STORAGE_PALETTE);
    const rawDarkPalette = localStorage.getItem(STORAGE_DARK_PALETTE);

    const savedMode = rawMode ?? 'light';

    let savedDarkPalette: ThemePalette = 'mono';

    if (isValidDarkPalette(rawDarkPalette)) {
      savedDarkPalette = rawDarkPalette;
    } else if (isValidDarkPalette(rawPalette) && rawPalette !== 'mono') {
      savedDarkPalette = rawPalette;
      localStorage.setItem(STORAGE_DARK_PALETTE, rawPalette);
    }

    const effectivePalette = savedMode === 'light' ? 'mono' : savedDarkPalette;

    setPaletteState(effectivePalette);
    setModeState(savedMode);
    localStorage.setItem(STORAGE_MODE, savedMode);
    localStorage.setItem(STORAGE_PALETTE, effectivePalette);
    localStorage.setItem(STORAGE_DARK_PALETTE, savedDarkPalette);
    applyTheme(effectivePalette, savedMode);
    setMounted(true);
  }, []);

  const setPalette = useCallback(
    (p: ThemePalette) => {
      if (mode === 'light') {
        setPaletteState('mono');
        localStorage.setItem(STORAGE_PALETTE, 'mono');
        applyTheme('mono', 'light');
        return;
      }

      const nextDarkPalette = VALID_DARK_PALETTES.includes(p) ? p : 'mono';
      setPaletteState(nextDarkPalette);
      localStorage.setItem(STORAGE_DARK_PALETTE, nextDarkPalette);
      localStorage.setItem(STORAGE_PALETTE, nextDarkPalette);
      applyTheme(nextDarkPalette, 'dark');
    },
    [mode]
  );

  const setMode = useCallback(
    (m: ThemeMode) => {
      if (m === 'light') {
        setModeState('light');
        setPaletteState('mono');
        localStorage.setItem(STORAGE_MODE, 'light');
        localStorage.setItem(STORAGE_PALETTE, 'mono');
        applyTheme('mono', 'light');
        return;
      }

      const rawDarkPalette = localStorage.getItem(STORAGE_DARK_PALETTE);
      const nextDarkPalette = isValidDarkPalette(rawDarkPalette) ? rawDarkPalette : 'mono';

      setModeState('dark');
      setPaletteState(nextDarkPalette);
      localStorage.setItem(STORAGE_MODE, 'dark');
      localStorage.setItem(STORAGE_DARK_PALETTE, nextDarkPalette);
      localStorage.setItem(STORAGE_PALETTE, nextDarkPalette);
      applyTheme(nextDarkPalette, 'dark');
    },
    []
  );

  const toggleMode = useCallback(() => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
  }, [mode, setMode]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ palette, mode, setPalette, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}