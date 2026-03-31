import { getPaletteById } from './palettes';
import type { ThemeMode, ThemeTokens, ThemePaletteId } from './theme-types';

function setCssVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

function applyTokens(tokens: ThemeTokens) {
  setCssVar('--background', tokens.background);
  setCssVar('--foreground', tokens.foreground);
  setCssVar('--card', tokens.card);
  setCssVar('--card-foreground', tokens.cardForeground);
  setCssVar('--popover', tokens.popover);
  setCssVar('--popover-foreground', tokens.popoverForeground);
  setCssVar('--sidebar', tokens.sidebar);
  setCssVar('--sidebar-border', tokens.sidebarBorder);
  setCssVar('--primary', tokens.primary);
  setCssVar('--primary-foreground', tokens.primaryForeground);
  setCssVar('--secondary', tokens.secondary);
  setCssVar('--secondary-foreground', tokens.secondaryForeground);
  setCssVar('--muted', tokens.muted);
  setCssVar('--muted-foreground', tokens.mutedForeground);
  setCssVar('--accent', tokens.accent);
  setCssVar('--accent-foreground', tokens.accentForeground);
  setCssVar('--destructive', tokens.destructive);
  setCssVar('--destructive-foreground', tokens.destructiveForeground);
  setCssVar('--border', tokens.border);
  setCssVar('--input', tokens.input);
  setCssVar('--ring', tokens.ring);

  if (tokens.radius) setCssVar('--radius', tokens.radius);
  if (tokens.chart1) setCssVar('--chart-1', tokens.chart1);
  if (tokens.chart2) setCssVar('--chart-2', tokens.chart2);
  if (tokens.chart3) setCssVar('--chart-3', tokens.chart3);
  if (tokens.chart4) setCssVar('--chart-4', tokens.chart4);
  if (tokens.chart5) setCssVar('--chart-5', tokens.chart5);
}

export function applyTheme(paletteId: ThemePaletteId, mode: ThemeMode) {
  const palette = getPaletteById(paletteId);
  const tokens = mode === 'light' ? palette.light : palette.dark;

  document.documentElement.setAttribute('data-palette', paletteId);
  document.documentElement.setAttribute('data-mode', mode);

  applyTokens(tokens);
}