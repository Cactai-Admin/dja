'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ParsedContentShape = {
  parsed_job?: Record<string, unknown>;
  parsed_company?: Record<string, unknown>;
  parsed_team?: Record<string, unknown>;
};

export interface RawContentModalProps {
  prompt: string;
  rawResponse: string;
  parsedContent: ParsedContentShape;
  onRawResponseChange: (value: string) => void;
  onParsedContentChange: (next: ParsedContentShape) => void;
}

export function RawContentModal({
  prompt,
  rawResponse,
  parsedContent,
  onRawResponseChange,
  onParsedContentChange,
}: RawContentModalProps) {
  const [open, setOpen] = useState(false);

  const parsedJson = useMemo(
    () => JSON.stringify(parsedContent ?? {}, null, 2),
    [parsedContent]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          View raw content
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Raw content editor</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Prompt
            </p>
            <textarea
              value={prompt}
              readOnly
              rows={18}
              className="w-full resize-none rounded-lg border border-border bg-black/20 px-3 py-2 text-xs leading-relaxed text-foreground"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Raw response
            </p>
            <textarea
              value={rawResponse}
              onChange={(e) => onRawResponseChange(e.target.value)}
              rows={18}
              className="w-full resize-none rounded-lg border border-border bg-black/20 px-3 py-2 text-xs leading-relaxed text-foreground"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Parsed content
            </p>
            <textarea
              value={parsedJson}
              onChange={(e) => {
                try {
                  const next = JSON.parse(e.target.value) as ParsedContentShape;
                  onParsedContentChange(next);
                } catch {
                  // Keep editing permissive; invalid JSON should not crash the modal.
                }
              }}
              rows={18}
              className="w-full resize-none rounded-lg border border-border bg-black/20 px-3 py-2 font-mono text-xs leading-relaxed text-foreground"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}