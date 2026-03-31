import { PipelinePage } from '@/components/pipeline/pipeline-page';
import { getAddedJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export default async function InterestedPipelinePage() { const jobs = await getAddedJobs(); return <PipelinePage title="Added Jobs" description="Listings in the added_jobs stage that are not started yet." jobs={jobs} />; }
