export type ThemePaletteId = 'volt-green' | 'volt-red' | 'volt-blue' | 'mono';
export type ThemeMode = 'light' | 'dark';

export type ThemeTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  sidebar: string;
  sidebarBorder: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius?: string;
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
};

export type ThemePalette = {
  id: ThemePaletteId;
  label: string;
  description: string;
  light: ThemeTokens;
  dark: ThemeTokens;
};