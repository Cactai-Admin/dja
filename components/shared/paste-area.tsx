'use client';
/* ============================================================
   PasteArea — Textarea for pasting LLM markdown output
   Shows validation status and character count
   ============================================================ */
import { useState, useCallback } from 'react';
import { ClipboardPaste, CircleCheck as CheckCircle2, Circle as XCircle, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArtifactType, ParseStatus } from '@/types';
import { parseArtifact } from '@/lib/artifacts/parser';

interface PasteAreaProps {
  artifactType: ArtifactType;
  placeholder?: string;
  initialValue?: string;
  onSave?: (content: string, parseStatus: ParseStatus, parsedContent: Record<string, unknown>) => Promise<void>;
  disabled?: boolean;
  label?: string;
  hint?: string;
}

export function PasteArea({
  artifactType,
  placeholder,
  initialValue = '',
  onSave,
  disabled = false,
  label,
  hint,
}: PasteAreaProps) {
  const [content, setContent] = useState(initialValue);
  const [parseStatus, setParseStatus] = useState<ParseStatus>(initialValue ? 'valid' : 'pending');
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(initialValue ? new Date() : null);

  const handleChange = useCallback((value: string) => {
    setContent(value);
    if (!value.trim()) {
      setParseStatus('pending');
      setParseErrors([]);
      return;
    }
    setParseStatus('parsing');
    const result = parseArtifact(artifactType, value);
    setParseStatus(result.success ? 'valid' : 'invalid');
    setParseErrors(result.errors);
  }, [artifactType]);

  const handleSave = async () => {
    if (!onSave || !content.trim()) return;
    setIsSaving(true);
    try {
      const result = parseArtifact(artifactType, content);
      await onSave(content, result.success ? 'valid' : 'invalid', result.data);
      setSavedAt(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const StatusIcon = () => {
    if (parseStatus === 'pending') return <AlertCircle className="h-4 w-4 text-muted-foreground/40" />;
    if (parseStatus === 'parsing') return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    if (parseStatus === 'valid') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    if (parseStatus === 'invalid') return <XCircle className="h-4 w-4 text-amber-400" />;
    return null;
  };

  const statusText = {
    pending: 'Waiting for content',
    parsing: 'Validating...',
    valid: 'Valid — ready to save',
    invalid: 'Needs attention',
    error: 'Parse error',
  }[parseStatus];

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      )}

      <div className={cn(
        'relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg',
        parseStatus === 'valid'
          ? 'border-emerald-500/30 shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_0_18px_rgba(16,185,129,0.12)]'
          : parseStatus === 'invalid'
          ? 'border-amber-500/30'
          : 'border-border'
      )}>
        <div className="flex items-center gap-2 border-b border-border bg-black/20 px-3 py-2">
          <ClipboardPaste className="h-3.5 w-3.5 text-muted-foreground/60" />
          <p className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Paste Markdown Output
          </p>
          <div className="flex items-center gap-1.5">
            <StatusIcon />
            <span className="text-[11px] text-muted-foreground">{statusText}</span>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder ?? `Paste your LLM output for this ${artifactType.replace(/_/g, ' ')} here...`}
          disabled={disabled}
          rows={12}
          className={cn(
            'w-full bg-black/10 px-4 py-3 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/30',
            'resize-none focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />

        <div className="flex items-center justify-between border-t border-border bg-black/20 px-3 py-2">
          <div className="flex items-center gap-3">
            {content && (
              <span className="text-[11px] text-muted-foreground/60">
                {content.split(/\s+/).filter(Boolean).length} words · {content.length} chars
              </span>
            )}
            {savedAt && (
              <span className="text-[11px] text-emerald-400/70">
                Saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {onSave && (
            <button
              onClick={handleSave}
              disabled={!content.trim() || isSaving || disabled}
              className={cn(
                'rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90',
                'shadow-sm shadow-primary/20 hover:shadow-[0_0_18px_hsl(var(--primary)/0.18)]',
                'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0'
              )}
            >
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              ) : 'Save Artifact'}
            </button>
          )}
        </div>
      </div>

      {parseErrors.length > 0 && (
        <div className="space-y-1 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
          {parseErrors.map((err, i) => (
            <p key={i} className="flex items-start gap-1.5 text-[11px] text-amber-400">
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
