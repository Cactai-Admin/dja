'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AutosaveBox } from './autosave-box';

interface RawContentModalProps {
  triggerLabel: string;
  prompt: string;
  rawContent: string;
  parsedContent: any;
  onRawChange: (value: string) => void;
  onRawSave?: (value: string) => Promise<void>;
}

export function RawContentModal({ triggerLabel, prompt, rawContent, parsedContent, onRawChange, onRawSave }: RawContentModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="text-xs font-medium text-primary hover:text-primary/80">{triggerLabel}</button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Raw Research Content</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Prompt</p>
            <div className="rounded-2xl border border-border bg-card p-3">
              <pre className="max-h-[30rem] overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{prompt}</pre>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Response</p>
            <AutosaveBox value={rawContent} onChange={onRawChange} onAutosave={onRawSave} rows={20} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Parsed Sections</p>
            <div className="rounded-2xl border border-border bg-card p-3">
              <pre className="max-h-[30rem] overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{JSON.stringify(parsedContent, null, 2)}</pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
