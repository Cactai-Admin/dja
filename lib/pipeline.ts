import type { ApplicationStage, PipelineJob, PipelineStage, WorkflowStage } from '@/types';

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { key: 'research', label: 'Research', description: 'Listing, company, and team research', href: (id) => `/jobs/${id}/research`, order: 0 },
  { key: 'questions', label: 'Keywords + Q&A', description: 'Keywords, questions, and reusable answers', href: (id) => `/jobs/${id}/questions`, order: 1 },
  { key: 'evidence', label: 'Evidence', description: 'Resume-ready evidence collection', href: (id) => `/jobs/${id}/evidence`, order: 2 },
  { key: 'resume', label: 'Resume', description: 'Build and approve the resume', href: (id) => `/jobs/${id}/documents`, order: 3 },
  { key: 'cover_letter', label: 'Cover Letter', description: 'Finalize the application letter', href: (id) => `/jobs/${id}`, order: 4 },
];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  added_jobs: 'Added Jobs', preparing: 'Preparing', applied: 'Applied', outcome: 'Outcome'
};

export function getCurrentWorkflowStage(stage: ApplicationStage | null): WorkflowStage | null {
  if (!stage) return null;
  return WORKFLOW_STAGES.find((s) => s.key === stage) ?? null;
}

export function getNextWorkflowStage(stage: ApplicationStage | null): WorkflowStage | null {
  if (!stage) return WORKFLOW_STAGES[0] ?? null;
  const current = getCurrentWorkflowStage(stage);
  if (!current) return null;
  return WORKFLOW_STAGES.find((s) => s.order === current.order + 1) ?? null;
}

export function getPipelineProgress(stage: PipelineStage): number {
  return { added_jobs: 10, preparing: 55, applied: 80, outcome: 100 }[stage] ?? 0;
}

export function getCurrentLifecycleLabel(job: PipelineJob): string { return PIPELINE_STAGE_LABELS[job.pipeline_stage]; }

export const PIPELINE_STAGE_COLORS: Record<PipelineStage, string> = { added_jobs: 'bg-blue-500/15 text-blue-400 border-blue-500/25', preparing: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25', applied: 'bg-violet-500/15 text-violet-400 border-violet-500/25', outcome: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' };
