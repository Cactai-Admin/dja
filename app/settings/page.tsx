'use client';

import type { ElementType } from 'react';
import { useTheme, PALETTES } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Sun, Moon, Check, Palette, Monitor } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';

const LIGHT_PALETTE_ORDER = ['mono'] as const;
const DARK_PALETTE_ORDER = ['mono', 'volt-green', 'volt-red', 'volt-blue'] as const;

export default function SettingsPage() {
  const { palette, mode, setPalette, setMode } = useTheme();

  const orderedPaletteIds =
    mode === 'light' ? LIGHT_PALETTE_ORDER : DARK_PALETTE_ORDER;

  const visiblePalettes = orderedPaletteIds
    .map((id) => PALETTES.find((p) => p.id === id))
    .filter((p): p is (typeof PALETTES)[number] => Boolean(p));

  return (
    <MainLayout>
      <div className="page-container-narrow space-y-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize your workspace appearance.
          </p>
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Appearance
            </h2>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
              Mode
            </p>

            <div className="flex flex-wrap gap-3">
              <ModeButton
                label="Light"
                icon={Sun}
                active={mode === 'light'}
                onClick={() => setMode('light')}
              />
              <ModeButton
                label="Dark"
                icon={Moon}
                active={mode === 'dark'}
                onClick={() => setMode('dark')}
              />
              <ModeButton
                label="System"
                icon={Monitor}
                active={false}
                onClick={() => {}}
                disabled
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                Color Palette
              </p>

              {mode === 'light' ? (
                <p className="text-xs text-muted-foreground">
                  Light mode uses Monochrome only.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Your last dark palette will be remembered.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visiblePalettes.map((p) => {
                const isActive = palette === p.id;
                const tokens = mode === 'dark' ? p.dark : p.light;
                const oppositeTokens = mode === 'dark' ? p.light : p.dark;

                return (
                  <button
                    key={p.id}
                    onClick={() => setPalette(p.id)}
                    className="group relative rounded-xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-1"
                    style={{
                      borderColor: isActive
                        ? `hsl(${tokens.primary})`
                        : `hsl(${tokens.border})`,
                      backgroundColor: `hsl(${tokens.card})`,
                      color: `hsl(${tokens.foreground})`,
                      boxShadow: isActive
                        ? `0 0 0 1px hsl(${tokens.primary} / 0.18), 0 0 18px hsl(${tokens.primary} / 0.22), 0 0 32px hsl(${tokens.primary} / 0.12)`
                        : '0 6px 18px hsl(0 0% 0% / 0.08)',
                    }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: `hsl(${tokens.background})` }}
                      />
                      <div
                        className="h-8 w-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: `hsl(${tokens.primary})` }}
                      />
                      <div
                        className="h-8 w-4 rounded-lg shadow-sm"
                        style={{
                          backgroundColor: `hsl(${oppositeTokens.background})`,
                          opacity: 0.7,
                        }}
                      />
                    </div>

                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{ color: `hsl(${tokens.foreground})` }}
                    >
                      {p.label}
                    </p>

                    <p
                      className="mt-0.5 text-xs leading-snug"
                      style={{ color: `hsl(${tokens.mutedForeground})` }}
                    >
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_6px_18px_hsl(0_0%_0%/0.08)]">
            <div className="border-b border-border bg-black/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Preview
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.18)]">
                  <Check className="h-5 w-5 text-primary-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Primary Action</p>
                  <p className="text-xs text-muted-foreground">
                    This is muted foreground text
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-primary/20 px-3 py-1 text-xs font-medium text-primary shadow-[0_0_18px_hsl(var(--primary)/0.10)]">
                  Tag Label
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  Secondary
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Muted
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-3/5 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.20)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              About
            </h2>
          </div>

          <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground shadow-[0_6px_18px_hsl(0_0%_0%/0.08)]">
            <p>
              <span className="font-medium text-foreground">Dream Job App</span> — MVP v0.1
            </p>
            <p>Copy prompts · Paste AI output · Build your application.</p>
            <p className="text-muted-foreground/50">
              Powered by Next.js, Supabase, and Inngest.
            </p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

interface ModeButtonProps {
  label: string;
  icon: ElementType;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ModeButton({
  label,
  icon: Icon,
  active = false,
  onClick,
  disabled = false,
}: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5',
        active
          ? 'border-primary bg-card text-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.18),0_0_18px_hsl(var(--primary)/0.18)]'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground hover:shadow-md',
        disabled && 'pointer-events-none cursor-not-allowed opacity-40 disabled:hover:translate-y-0'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
 