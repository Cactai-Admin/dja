'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ClipboardPaste,
  CircleCheck as CheckCircle2,
  CircleAlert as AlertCircle,
  Loader as Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ParseStatus = 'idle' | 'parsing' | 'valid' | 'invalid' | 'error';

interface PasteAreaProps {
  value?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  onChange?: (value: string) => void;
  onAutosave?: (value: string) => Promise<void> | void;
}

export function PasteArea({
  value = '',
  placeholder = 'Paste content here...',
  rows = 10,
  className,
  onChange,
  onAutosave,
}: PasteAreaProps) {
  const [text, setText] = useState(value);
  const [status, setStatus] = useState<ParseStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (!onAutosave) return;

    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }

    setStatus('parsing');

    autosaveTimer.current = setTimeout(async () => {
      try {
        await onAutosave(text);
        setStatus('valid');
        setLastSavedAt(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      } catch {
        setStatus('error');
      }
    }, 700);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [text, onAutosave]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'parsing':
        return 'Saving…';
      case 'valid':
        return lastSavedAt ? `Saved ${lastSavedAt}` : 'Saved';
      case 'invalid':
        return 'Invalid content';
      case 'error':
        return 'Save failed';
      default:
        return 'Autosave idle';
    }
  }, [status, lastSavedAt]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ClipboardPaste className="h-4 w-4" />
          <span>Paste content</span>
        </div>

        <div
          className={cn(
            'inline-flex items-center gap-1.5 text-xs',
            status === 'valid' && 'text-emerald-400',
            status === 'parsing' && 'text-primary',
            status === 'error' && 'text-red-400',
            status === 'invalid' && 'text-amber-400',
            status === 'idle' && 'text-muted-foreground'
          )}
        >
          {status === 'parsing' ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : status === 'valid' ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : status === 'error' || status === 'invalid' ? (
            <AlertCircle className="h-3.5 w-3.5" />
          ) : null}
          <span>{statusLabel}</span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-border bg-black/20 px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none"
      />
    </div>
  );
}