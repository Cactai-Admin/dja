'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { IconCopyButton } from '@/components/workflow/icon-copy-button';
import { AutosaveBox } from '@/components/workflow/autosave-box';
import { ActivationGrid } from '@/components/workflow/activation-grid';
import { buildEvidencePrompt } from '@/lib/research-workflow';
import type {
  ApplicationAnswer,
  ApplicationEvidence,
  ApplicationKeyword,
  PipelineJob,
} from '@/types';

function parseEvidence(raw: string, applicationId: string, answers: ApplicationAnswer[]) {
  const chunks = raw
    .split(/\n##\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return chunks.map((chunk, index) => ({
    application_id: applicationId,
    title: chunk.split('\n')[0]?.replace(/^#\s*/, '') || `Evidence ${index + 1}`,
    resume_bullet: chunk,
    source_application_answer_id: answers[index]?.id ?? null,
    company: '',
    department: '',
    role: '',
    dates: '',
    situation: '',
    task: '',
    action: '',
    result: '',
    metrics: [],
    tools: [],
    technologies: [],
    skills: [],
    keywords: [],
    evidence_type: 'resume_bullet',
  }));
}

export default function EvidencePage() {
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<PipelineJob | null>(null);
  const [answers, setAnswers] = useState<ApplicationAnswer[]>([]);
  const [keywords, setKeywords] = useState<ApplicationKeyword[]>([]);
  const [raw, setRaw] = useState('');
  const [parsed, setParsed] = useState<ApplicationEvidence[]>([]);

  useEffect(() => {
    const run = async () => {
      const jobRes = await fetch(`/api/jobs/${id}`, { cache: 'no-store' });
      const jobPayload = await jobRes.json();
      setJob(jobPayload.data);

      const appId = jobPayload.data?.application_id;
      if (!appId) return;

      const [answersRes, keywordsRes, evidenceRes] = await Promise.all([
        fetch(`/api/application-answers?application_id=${appId}`),
        fetch(`/api/application-keywords?application_id=${appId}`),
        fetch(`/api/application-evidence?application_id=${appId}`),
      ]);

      const [answersPayload, keywordsPayload, evidencePayload] = await Promise.all([
        answersRes.json(),
        keywordsRes.json(),
        evidenceRes.json(),
      ]);

      setAnswers(answersPayload.data ?? []);
      setKeywords(
        (keywordsPayload.data ?? []).filter(
          (item: ApplicationKeyword) => item.is_selected && !item.is_hidden
        )
      );
      setParsed(evidencePayload.data ?? []);

      if ((evidencePayload.data ?? [])[0]?.resume_bullet) {
        setRaw(
          (evidencePayload.data ?? [])
            .map((item: ApplicationEvidence) => `## ${item.title}\n${item.resume_bullet}`)
            .join('\n\n')
        );
      }
    };

    void run();
  }, [id]);

  const prompt = useMemo(
    () =>
      buildEvidencePrompt({
        title: job?.title || '',
        company: job?.company || '',
        answers: answers.map((item) => `- ${item.answer_text}`).join('\n'),
        keywords: keywords.map((item) => item.keyword),
      }),
    [job, answers, keywords]
  );

  async function handleParse() {
    if (!job?.application_id) return;

    const units = parseEvidence(raw, job.application_id, answers);
    setParsed(units as ApplicationEvidence[]);

    await fetch('/api/application-evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(units),
    });

    await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        application_stage: 'resume',
        application_resume_started_at: new Date().toISOString(),
      }),
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Employment Experience</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate resume-ready bullets from the answers you just completed.
            </p>
          </div>

          <Link
            href={`/jobs/${id}/documents`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            Build My Resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[auto,1fr,auto]">
        <IconCopyButton text={prompt} className="h-12 w-12" />

        <AutosaveBox
          value={raw}
          onChange={setRaw}
          rows={12}
          placeholder="Paste the normalized evidence response here..."
        />

        <button
          type="button"
          onClick={handleParse}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-4 text-sm font-semibold text-primary hover:bg-primary/15"
        >
          Parse Experience
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <ActivationGrid
          parsed={{
            job: { keywords: keywords.map((item) => item.keyword) },
            company: { summary: [] },
            team: { resume_signals: parsed.map((item) => item.title) },
          }}
        />
      </div>
    </div>
  );
}