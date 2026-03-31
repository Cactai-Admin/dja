'use client';
import { useEffect, useMemo, useState } from 'react';
import { Briefcase, Building2, Users } from 'lucide-react';
import { RESEARCH_SEGMENTS } from '@/lib/research-workflow';
import { cn } from '@/lib/utils';

const ICONS: Record<string, any> = { Briefcase, Building2, Users };

export function ActivationGrid({ parsed }: { parsed: any }) {
  const activeKeys = useMemo(() => {
    const keys: string[] = [];
    RESEARCH_SEGMENTS.forEach((segment) => {
      const segmentData = parsed?.[segment.key] || {};
      const hasSegmentData = segment.subcategories.some((sub) => (segmentData[sub.key] || []).length > 0);
      if (hasSegmentData) keys.push(segment.key);
      segment.subcategories.forEach((sub) => {
        if ((segmentData[sub.key] || []).length > 0) keys.push(`${segment.key}.${sub.key}`);
      });
    });
    return keys;
  }, [parsed]);

  const [lit, setLit] = useState<string[]>([]);

  useEffect(() => {
    setLit([]);
    activeKeys.forEach((key, index) => {
      const timeout = window.setTimeout(() => {
        setLit((prev) => (prev.includes(key) ? prev : [...prev, key]));
      }, index * 120);
      return () => window.clearTimeout(timeout);
    });
  }, [activeKeys]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {RESEARCH_SEGMENTS.map((segment) => {
        const Icon = ICONS[segment.icon];
        const segmentLit = lit.includes(segment.key);
        return (
          <div key={segment.key} className="rounded-2xl border border-border bg-card p-4">
            <div className={cn('mb-4 flex items-center gap-3 transition-all', segmentLit ? 'text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.55)]' : 'text-muted-foreground')}>
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl border', segmentLit ? 'border-primary/40 bg-primary/10' : 'border-border bg-black/20')}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{segment.label}</p>
                <p className="text-xs text-muted-foreground">Research segment</p>
              </div>
            </div>
            <div className="space-y-2">
              {segment.subcategories.map((sub) => {
                const subLit = lit.includes(`${segment.key}.${sub.key}`);
                return (
                  <div
                    key={sub.key}
                    className={cn(
                      'flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all duration-300',
                      subLit
                        ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.18)]'
                        : 'border-border bg-black/10 text-muted-foreground'
                    )}
                  >
                    <span>{sub.label}</span>
                    <span className={cn('h-2.5 w-2.5 rounded-full', subLit ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]' : 'bg-muted')} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
