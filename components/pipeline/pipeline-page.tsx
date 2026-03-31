import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { JobCard } from '@/components/dashboard/job-card';
import type { Job } from '@/types';

interface PipelinePageProps {
  title: string;
  description: string;
  jobs: Job[];
}

export function PipelinePage({ title, description, jobs }: PipelinePageProps) {
  return (
    <MainLayout>
      <div className="page-container space-y-6">
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
              {jobs.length} jobs
            </div>
          </div>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center">
            <h2 className="text-lg font-semibold text-foreground">No jobs here yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <div className="mt-5 flex justify-center">
              <Link
                href="/jobs/new"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                It's a Ghost Town Around Here...Add a New Job to Get Started
              </Link>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
