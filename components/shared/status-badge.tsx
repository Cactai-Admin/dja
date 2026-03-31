/* StatusBadge — pipeline lifecycle chip */
import { PIPELINE_STAGE_COLORS, PIPELINE_STAGE_LABELS } from '@/lib/pipeline';
import type { PipelineStage } from '@/types';
import { cn } from '@/lib/utils';

export function StatusBadge({ stage, fallbackLabel = 'New', className }: { stage: PipelineStage | null; fallbackLabel?: string; className?: string; }) {
  const label = stage ? PIPELINE_STAGE_LABELS[stage] : fallbackLabel;
  const color = stage ? PIPELINE_STAGE_COLORS[stage] : 'bg-slate-500/15 text-slate-300 border-slate-500/25';
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium', color, className)}>{label}</span>;
}
