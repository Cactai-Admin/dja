import { Send, MessagesSquare, Ghost, FileCheck } from 'lucide-react';
import type { PipelineJob } from '@/types';

export function StatsBar({ jobs }: { jobs: PipelineJob[] }) {
  const countByStage = (stage: PipelineJob['pipeline_stage']) => jobs.filter((job) => job.pipeline_stage === stage).length;
  const interviewing = jobs.filter((job) => job.application_stage === 'interviewing').length;
  const ghosted = jobs.filter((job) => !!job.job_listing_ghosted_at).length;
  const stats = [
    { label: 'Preparing', value: countByStage('preparing'), icon: FileCheck, color: 'text-navy-400' },
    { label: 'Applied', value: countByStage('applied'), icon: Send, color: 'text-violet-400' },
    { label: 'Interviews', value: interviewing, icon: MessagesSquare, color: 'text-emerald-400' },
    { label: 'Ghosted', value: ghosted, icon: Ghost, color: 'text-zinc-300' },
  ];
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{stats.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-xl border border-border bg-card px-4 py-3 shadow-[0_6px_18px_hsl(0_0%_0%/0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"><div className="mb-1.5 flex items-center gap-2"><Icon className={`h-4 w-4 ${color}`} /><span className="text-xs text-muted-foreground">{label}</span></div><p className="text-2xl font-bold tabular-nums text-foreground">{value}</p></div>)}</div>;
}
