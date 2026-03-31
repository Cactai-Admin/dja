/* ============================================================
   Job Detail Layout — Shared header with step navigation
   ============================================================ */
import { MainLayout } from '@/components/layout/main-layout';
import { JobHeader } from '@/components/jobs/job-header';
import { getJobById } from '@/lib/jobs';

async function getJob(id: string) {
  return getJobById(id);
}

interface JobLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function JobLayout({ children, params }: JobLayoutProps) {
  const job = await getJob(params.id);

  return (
    <MainLayout>
      {job && <JobHeader job={job} />}
      <div className="page-container-detail">{children}</div>
    </MainLayout>
  );
}