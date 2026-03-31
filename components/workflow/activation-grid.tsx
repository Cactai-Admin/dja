'use client';

import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Building2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESEARCH_SEGMENTS } from '@/lib/research-workflow';

type ParsedSegmentData = Record<string, unknown>;
type ParsedShape = {
  job?: ParsedSegmentData;
  company?: ParsedSegmentData;
  team?: ParsedSegmentData;
};

interface ActivationGridProps {
  parsed: ParsedShape;
}

const ICONS = {
  briefcase: BriefcaseBusiness,
  building: Building2,
  users: Users,
} as const;

function hasData(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (value && typeof value === 'object') return Object.keys(value as object).length > 0;
  return Boolean(value);
}

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function ActivationGrid({ parsed }: ActivationGridProps) {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const orderedKeys = useMemo(() => {
    const keys: string[] = [];

    RESEARCH_SEGMENTS.forEach((segment) => {
      const segmentData = parsed?.[segment.key] || {};
      const hasSegmentData = segment.fields.some((field) =>
        hasData((segmentData as ParsedSegmentData)[field])
      );

      if (hasSegmentData) keys.push(segment.key);

      segment.fields.forEach((field) => {
        if (hasData((segmentData as ParsedSegmentData)[field])) {
          keys.push(`${segment.key}.${field}`);
        }
      });
    });

    return keys;
  }, [parsed]);

  useEffect(() => {
    setActiveKeys([]);

    orderedKeys.forEach((key, index) => {
      const timer = setTimeout(() => {
        setActiveKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
      }, index * 120);

      return () => clearTimeout(timer);
    });
  }, [orderedKeys]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {RESEARCH_SEGMENTS.map((segment) => {
        const Icon = ICONS[segment.icon];
        const segmentIsActive = activeKeys.includes(segment.key);

        return (
          <div
            key={segment.key}
            className={cn(
              'rounded-2xl border bg-card p-4 transition-all duration-300',
              segmentIsActive
                ? 'border-primary/40 shadow-lg shadow-primary/10'
                : 'border-border'
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300',
                  segmentIsActive
                    ? 'border-primary/40 bg-primary/10 text-primary shadow-md shadow-primary/20'
                    : 'border-border bg-black/20 text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p
                  className={cn(
                    'text-sm font-semibold transition-colors duration-300',
                    segmentIsActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {segment.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {segment.fields.length} subcategories
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {segment.fields.map((field) => {
                const fieldKey = `${segment.key}.${field}`;
                const fieldIsActive = activeKeys.includes(fieldKey);

                return (
                  <div
                    key={field}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all duration-300',
                      fieldIsActive
                        ? 'border-primary/30 bg-primary/10 text-foreground shadow-sm shadow-primary/10'
                        : 'border-border bg-black/10 text-muted-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rounded-full transition-all duration-300',
                        fieldIsActive ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-muted'
                      )}
                    />
                    <span>{formatLabel(field)}</span>
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