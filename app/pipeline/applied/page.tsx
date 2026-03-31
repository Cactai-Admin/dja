import { PipelinePage } from '@/components/pipeline/pipeline-page';
import { getJobsByPipelineStage } from '@/lib/jobs';

export default async function AppliedPipelinePage() { const jobs = await getJobsByPipelineStage('applied'); return <PipelinePage title="Applied" description="Listings with an active sent/received/interview/offer state." jobs={jobs} />; }
