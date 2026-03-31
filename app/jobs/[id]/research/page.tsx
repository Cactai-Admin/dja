'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { IconCopyButton } from '@/components/workflow/icon-copy-button';
import { AutosaveBox } from '@/components/workflow/autosave-box';
import { ActivationGrid } from '@/components/workflow/activation-grid';
import { RawContentModal } from '@/components/workflow/raw-content-modal';
import { buildUnifiedResearchPrompt, parseUnifiedResearch } from '@/lib/research-workflow';
import type { JobListingResearch, PipelineJob } from '@/types';

export default function ResearchPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<PipelineJob | null>(null);
  const [research, setResearch] = useState<JobListingResearch | null>(null);
  const [responseText, setResponseText] = useState('');
  const [parsedJob, setParsedJob] = useState<any>({});
  const [parsedCompany, setParsedCompany] = useState<any>({});
  const [parsedTeam, setParsedTeam] = useState<any>({});
  const [parsing, setParsing] = useState(false);

  useEffect(() => { (async () => {
    const [jobRes, researchRes] = await Promise.all([ fetch(`/api/jobs/${id}`, { cache: 'no-store' }), fetch(`/api/job-listing-research?job_listing_id=${id}`, { cache: 'no-store' }) ]);
    const jobPayload = await jobRes.json(); const researchPayload = await researchRes.json();
    setJob(jobPayload.data); setResearch(researchPayload.data); setResponseText(researchPayload.data?.raw_response ?? ''); setParsedJob(researchPayload.data?.parsed_job ?? {}); setParsedCompany(researchPayload.data?.parsed_company ?? {}); setParsedTeam(researchPayload.data?.parsed_team ?? {});
  })(); }, [id]);

  const prompt = useMemo(() => buildUnifiedResearchPrompt({ title: job?.title || '', company: job?.company || '', location: job?.location || '', url: job?.url || '', rawDescription: job?.raw_description || '' }), [job]);

  async function persist(raw_response: string, next: any) {
    const res = await fetch('/api/job-listing-research', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ job_listing_id: id, prompt_text: prompt, raw_response, parsed_job: next.parsed_job, parsed_company: next.parsed_company, parsed_team: next.parsed_team, completed_at: new Date().toISOString() }) });
    const payload = await res.json(); if (payload.data) setResearch(payload.data);
  }
  async function handleParse() { setParsing(true); try { const next = parseUnifiedResearch(responseText); setParsedJob(next.parsed_job); setParsedCompany(next.parsed_company); setParsedTeam(next.parsed_team); await persist(responseText, next); await fetch(`/api/jobs/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ application_stage:'questions', application_questions_started_at:new Date().toISOString() }) }); } finally { setParsing(false); } }

  return (<div className="space-y-6"><div className="rounded-2xl border border-border bg-card p-4"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-semibold text-foreground">Unified listing research</p><p className="mt-1 text-sm text-muted-foreground">One prompt, one response block, three parsed segments.</p></div><Link href={`/jobs/${id}/questions`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">Continue to Keywords + Q&A <ArrowRight className="h-4 w-4" /></Link></div></div><div className="grid gap-4 md:grid-cols-[auto,1fr,auto]"><IconCopyButton text={prompt} className="h-12 w-12" /><AutosaveBox value={responseText} onChange={setResponseText} onAutosave={async (value) => persist(value, { parsed_job: parsedJob, parsed_company: parsedCompany, parsed_team: parsedTeam })} rows={12} placeholder="Paste the unified research response here..." /><button type="button" onClick={handleParse} className="inline-flex h-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 px-4 text-sm font-semibold text-primary hover:bg-primary/15">{parsing ? 'Parsing…' : 'Parse research'}</button></div><RawContentModal prompt={prompt} rawResponse={responseText} parsedContent={{ parsed_job: parsedJob, parsed_company: parsedCompany, parsed_team: parsedTeam }} onRawResponseChange={setResponseText} onParsedContentChange={(next) => { setParsedJob(next.parsed_job || {}); setParsedCompany(next.parsed_company || {}); setParsedTeam(next.parsed_team || {}); }} /><div className="rounded-2xl border border-border bg-card p-4"><div className="mb-4 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><p className="text-sm font-semibold text-foreground">Research activation map</p></div><ActivationGrid parsed={{ job: parsedJob, company: parsedCompany, team: parsedTeam }} /></div></div>);
}
