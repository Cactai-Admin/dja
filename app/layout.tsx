import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/lib/theme-context';

export const metadata: Metadata = {
  title: 'Dream Job App',
  description: 'From job search to hired — easy, fast, professional.',
};

const themeInitScript = `
(function () {
  try {
    var STORAGE_PALETTE = 'dja-palette';
    var STORAGE_MODE = 'dja-mode';
    var STORAGE_DARK_PALETTE = 'dja-dark-palette';

    var mode = localStorage.getItem(STORAGE_MODE) || 'light';
    var savedPalette = localStorage.getItem(STORAGE_PALETTE) || 'mono';
    var savedDarkPalette = localStorage.getItem(STORAGE_DARK_PALETTE) || 'mono';
    var root = document.documentElement;

    var palette = mode === 'light' ? 'mono' : savedDarkPalette;

    if (savedPalette && savedPalette !== 'mono') {
      savedDarkPalette = savedPalette;
      localStorage.setItem(STORAGE_DARK_PALETTE, savedDarkPalette);
      if (mode === 'dark') {
        palette = savedDarkPalette;
      }
    }

    var PALETTES = {
      'volt-green': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem'
        },
        dark: {
          background: '0 0% 10%',
          foreground: '0 0% 95%',
          card: '0 0% 12%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 11%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 8%',
          sidebarBorder: '0 0% 17%',
          primary: '71 100% 49%',
          primaryForeground: '0 0% 6%',
          secondary: '0 0% 16%',
          secondaryForeground: '0 0% 90%',
          muted: '0 0% 15%',
          mutedForeground: '0 0% 55%',
          accent: '0 0% 17%',
          accentForeground: '0 0% 95%',
          destructive: '0 80% 55%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 18%',
          input: '0 0% 14%',
          ring: '71 100% 49%',
          radius: '0.625rem'
        }
      },
      'volt-red': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem'
        },
        dark: {
          background: '0 0% 10%',
          foreground: '0 0% 95%',
          card: '0 0% 12%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 11%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 8%',
          sidebarBorder: '0 0% 17%',
          primary: '352 100% 52%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 16%',
          secondaryForeground: '0 0% 90%',
          muted: '0 0% 15%',
          mutedForeground: '0 0% 55%',
          accent: '0 0% 17%',
          accentForeground: '0 0% 95%',
          destructive: '0 80% 55%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 18%',
          input: '0 0% 14%',
          ring: '352 100% 52%',
          radius: '0.625rem'
        }
      },
      'volt-blue': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem',
          chart1: '0 0% 12%',
          chart2: '0 0% 24%',
          chart3: '0 0% 36%',
          chart4: '0 0% 52%',
          chart5: '0 0% 68%'
        },
        dark: {
          background: '0 0% 10%',
          foreground: '0 0% 95%',
          card: '0 0% 12%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 11%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 8%',
          sidebarBorder: '0 0% 17%',
          primary: '217 91% 55%',
          primaryForeground: '0 0% 100%',
          secondary: '217 30% 15%',
          secondaryForeground: '210 40% 90%',
          muted: '220 25% 14%',
          mutedForeground: '215 25% 58%',
          accent: '217 30% 16%',
          accentForeground: '210 40% 95%',
          destructive: '0 80% 60%',
          destructiveForeground: '0 0% 100%',
          border: '220 30% 16%',
          input: '220 30% 14%',
          ring: '217 91% 55%',
          radius: '0.625rem',
          chart1: '217 80% 60%',
          chart2: '172 66% 50%',
          chart3: '43 96% 56%',
          chart4: '142 76% 46%',
          chart5: '25 95% 60%'
        }
      },
      'mono': {
        light: {
          background: '0 0% 100%',
          foreground: '0 0% 5%',
          card: '0 0% 98%',
          cardForeground: '0 0% 5%',
          popover: '0 0% 100%',
          popoverForeground: '0 0% 5%',
          sidebar: '0 0% 96%',
          sidebarBorder: '0 0% 88%',
          primary: '0 0% 6%',
          primaryForeground: '0 0% 100%',
          secondary: '0 0% 92%',
          secondaryForeground: '0 0% 5%',
          muted: '0 0% 94%',
          mutedForeground: '0 0% 44%',
          accent: '0 0% 92%',
          accentForeground: '0 0% 5%',
          destructive: '0 70% 45%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 88%',
          input: '0 0% 94%',
          ring: '0 0% 20%',
          radius: '0.625rem',
          chart1: '0 0% 12%',
          chart2: '0 0% 24%',
          chart3: '0 0% 36%',
          chart4: '0 0% 52%',
          chart5: '0 0% 68%'
        },
        dark: {
          background: '0 0% 4%',
          foreground: '0 0% 95%',
          card: '0 0% 7%',
          cardForeground: '0 0% 95%',
          popover: '0 0% 6%',
          popoverForeground: '0 0% 95%',
          sidebar: '0 0% 5%',
          sidebarBorder: '0 0% 12%',
          primary: '0 0% 83%',
          primaryForeground: '0 0% 5%',
          secondary: '0 0% 13%',
          secondaryForeground: '0 0% 90%',
          muted: '0 0% 12%',
          mutedForeground: '0 0% 52%',
          accent: '0 0% 14%',
          accentForeground: '0 0% 95%',
          destructive: '0 70% 55%',
          destructiveForeground: '0 0% 100%',
          border: '0 0% 14%',
          input: '0 0% 12%',
          ring: '0 0% 70%',
          radius: '0.625rem',
          chart1: '0 0% 83%',
          chart2: '0 0% 68%',
          chart3: '0 0% 52%',
          chart4: '0 0% 36%',
          chart5: '0 0% 24%'
        }
      }
    };

    var paletteSet = PALETTES[palette] || PALETTES['mono'];
    var tokens = paletteSet[mode] || paletteSet.light;

    root.setAttribute('data-palette', palette);
    root.setAttribute('data-mode', mode);

    Object.keys(tokens).forEach(function (key) {
      var cssVar = '--' + key.replace(/[A-Z]/g, function (m) {
        return '-' + m.toLowerCase();
      });
      root.style.setProperty(cssVar, tokens[key]);
    });
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-palette="mono" data-mode="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}