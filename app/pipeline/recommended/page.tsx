import { PipelinePage } from '@/components/pipeline/pipeline-page';
import { getRecommendedJobs } from '@/lib/jobs';

export default async function RecommendedPipelinePage() { const jobs = await getRecommendedJobs(); return <PipelinePage title="Recommended" description="Listings recommended to you but not yet added to your active workflow." jobs={jobs} />; }
