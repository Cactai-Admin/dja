'use client';
/* ============================================================
   Sidebar — Desktop navigation shell
   ============================================================ */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Plus,
  Sparkles,
  ChevronRight,
  Settings,
  Send,
  FileCheck2,
  Heart,
  Stars,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const PIPELINE_ITEMS = [
  { href: '/pipeline/applied', label: 'Applied', icon: Send },
  { href: '/pipeline/ready', label: 'Ready', icon: FileCheck2 },
  { href: '/pipeline/interested', label: 'Interested', icon: Heart },
  { href: '/pipeline/recommended', label: 'Recommended', icon: Stars },
];

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
        style={{
          boxShadow:
            '0 0 18px hsl(var(--primary) / 0.45), 0 0 36px hsl(var(--primary) / 0.22)',
        }}
      >
        <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold uppercase leading-tight text-foreground">
          Dream Job
        </p>
        <p className="truncate text-xs leading-tight tracking-wide text-muted-foreground">
          by Cactai Inc.
        </p>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
  trailing?: React.ReactNode;
  className?: string;
  childrenClassName?: string;
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active = false,
  trailing,
  className,
  childrenClassName,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
        className
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', childrenClassName)} />
      <span className="truncate">{label}</span>
      {trailing}
    </Link>
  );
}

function SettingsNavLink({ active, useDarkTextOnSettingsButton }: {
  active: boolean;
  useDarkTextOnSettingsButton: boolean;
}) {
  return (
    <Link
      href="/settings"
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5',
        active
          ? cn(
              'bg-primary shadow-lg shadow-primary/20',
              useDarkTextOnSettingsButton ? 'text-black/80' : 'text-primary-foreground'
            )
          : 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground'
      )}
    >
      <Settings className="h-4 w-4 shrink-0" />
      Settings
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { palette, mode } = useTheme();
  const useDarkTextOnSettingsButton = palette === 'volt-green' && mode === 'dark';

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="border-b border-sidebar-border px-5 py-5">
        <Link href="/dashboard" className="group flex items-center gap-2.5">
          <BrandMark />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <SidebarLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href}
          />
        ))}

        <div className="px-3 pb-1 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Pipeline
          </p>
        </div>

        {PIPELINE_ITEMS.map(({ href, label, icon }) => (
          <SidebarLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href}
            trailing={<ChevronRight className="ml-auto h-3 w-3 opacity-40" />}
          />
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-sidebar-border px-3 py-3 safe-bottom">
        <SettingsNavLink
          active={pathname === '/settings'}
          useDarkTextOnSettingsButton={useDarkTextOnSettingsButton}
        />
        <p className="px-3 pt-1 text-[10px] leading-relaxed text-muted-foreground/40">
          Dream Job App · v1 rewrite
        </p>
      </div>
    </aside>
  );
}
 