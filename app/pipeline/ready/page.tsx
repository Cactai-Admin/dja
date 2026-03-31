import { PipelinePage } from '@/components/pipeline/pipeline-page';
import { getVisibleJobs } from '@/lib/jobs';

export default async function ReadyPipelinePage() { const jobs = (await getVisibleJobs()).filter((job) => job.application_stage === 'completed'); return <PipelinePage title="Ready" description="Listings with a completed application packet that is ready to submit." jobs={jobs} />; }
