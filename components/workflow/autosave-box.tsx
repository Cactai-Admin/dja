'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutosaveBoxProps {
  value: string;
  onChange: (value: string) => void;
  onAutosave?: (value: string) => Promise<void>;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function AutosaveBox({ value, onChange, onAutosave, placeholder, rows = 10, className }: AutosaveBoxProps) {
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(value);

  useEffect(() => {
    if (!onAutosave) return;
    if (value === lastSavedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        await onAutosave(value);
        lastSavedRef.current = value;
        setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } finally {
        setSaving(false);
      }
    }, 700);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onAutosave]);

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border bg-card', className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent px-4 py-3 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
      />
      <div className="flex items-center justify-between border-t border-border bg-black/20 px-3 py-2 text-[11px] text-muted-foreground">
        <span>{value.split(/\s+/).filter(Boolean).length} words</span>
        <span className="flex items-center gap-2">
          {saving ? <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</> : savedAt ? `Saved ${savedAt}` : 'Autosave idle'}
        </span>
      </div>
    </div>
  );
}
