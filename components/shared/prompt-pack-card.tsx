'use client';
/* ============================================================
   PromptPackCard — Displays a prompt pack with copy button
   ============================================================ */
import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { CopyButton } from './copy-button';
import type { PromptPack } from '@/types';
import { cn } from '@/lib/utils';

interface PromptPackCardProps {
  pack: PromptPack;
  index?: number;
  defaultExpanded?: boolean;
}

export function PromptPackCard({ pack, index, defaultExpanded = false }: PromptPackCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-xl',
        expanded && 'shadow-[0_0_0_1px_hsl(var(--primary)/0.12),0_0_20px_hsl(var(--primary)/0.10)]'
      )}
    >
      <div
        className="flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-white/[0.02]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-card shadow-[0_0_18px_hsl(var(--primary)/0.10)]">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {index !== undefined && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                #{index + 1}
              </span>
            )}
            <p className="text-sm font-semibold text-foreground">{pack.title}</p>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{pack.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {expanded && (
            <div onClick={(e) => e.stopPropagation()}>
              <CopyButton text={pack.prompt} label="Copy Prompt" variant="outline" />
            </div>
          )}
          <button className="rounded-md p-1 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border">
          <div className="bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Prompt
              </p>
              <CopyButton text={pack.prompt} label="Copy Full Prompt" variant="default" />
            </div>
            <pre className="scrollbar-thin max-h-80 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
              {pack.prompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
