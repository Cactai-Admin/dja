import type { PipelineJob, PipelineStage } from '@/types';

async function createSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export async function getJobs(): Promise<PipelineJob[]> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.from('pipeline_job_listing_state').select('*').order('job_listing_added_at', { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PipelineJob[];
}

export async function getJobById(id: string): Promise<PipelineJob | null> {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase.from('pipeline_job_listing_state').select('*').eq('job_listing_id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return ((data ? { ...data, id: data.job_listing_id } : null) as PipelineJob | null);
}

export async function getVisibleJobs(): Promise<PipelineJob[]> { return getJobs(); }
export async function getJobsByPipelineStage(stage: PipelineStage): Promise<PipelineJob[]> { const jobs = await getJobs(); return jobs.filter((j) => j.pipeline_stage === stage); }
export async function getRecommendedJobs(): Promise<PipelineJob[]> { const jobs = await getJobs(); return jobs.filter((j) => !!j.job_listing_recommended_at && !j.job_listing_added_at); }
export async function getInterestedJobs(): Promise<PipelineJob[]> { const jobs = await getJobs(); return jobs.filter((j) => !!j.job_listing_added_at && j.pipeline_stage === 'new'); }
