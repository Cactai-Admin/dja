import { PipelinePage } from '@/components/pipeline/pipeline-page';
import { getInterestedJobs } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export default async function InterestedPipelinePage() { const jobs = await getInterestedJobs(); return <PipelinePage title="Interested" description="Listings you added and have not started working yet." jobs={jobs} />; }
