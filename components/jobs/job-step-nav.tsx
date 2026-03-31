'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, Dot } from 'lucide-react';
import { WORKFLOW_STAGES } from '@/lib/pipeline';
import { cn } from '@/lib/utils';
import type { ApplicationStage } from '@/types';

export function JobStepNav({ jobId, currentStage }: { jobId: string; currentStage: ApplicationStage | null }) {
  const pathname = usePathname();
  const currentOrder = currentStage ? WORKFLOW_STAGES.find((s) => s.key === currentStage)?.order ?? -1 : -1;
  return (<div className="space-y-2"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">Journey</p><p className="text-xs text-muted-foreground">{Math.max(currentOrder + 1, 0)} / {WORKFLOW_STAGES.length}</p></div><nav className="grid gap-3 sm:grid-cols-6 lg:grid-cols-3">{WORKFLOW_STAGES.map((stage)=>{ const href=stage.href(jobId); const isActive=pathname===href || (stage.key==='cover_letter' && pathname===`/jobs/${jobId}`); const isCurrent=stage.key===currentStage; const isCompleted=currentOrder>stage.order; return <Link key={stage.key} href={href} className={cn('rounded-2xl border p-4 transition-all', isActive ? 'border-primary/30 bg-primary/10 shadow-sm shadow-primary/10' : 'border-border bg-card hover:border-primary/20 hover:bg-card/80')}><div className="mb-2 flex items-center justify-between gap-3"><div className={cn('flex h-7 w-7 items-center justify-center rounded-full', isActive ? 'bg-primary text-primary-foreground' : isCompleted ? 'bg-emerald-500/15 text-emerald-400' : isCurrent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>{isCompleted && !isActive ? <Check className="h-3.5 w-3.5" /> : isCurrent ? <Dot className="h-5 w-5" /> : <span className="text-[11px] font-semibold">{stage.order + 1}</span>}</div>{isCurrent ? <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">Now</span> : null}</div><p className="text-sm font-semibold text-foreground">{stage.label}</p><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{stage.description}</p></Link>; })}</nav></div>);
}
