'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, CheckSquare, Copy, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutosaveBox } from '@/components/workflow/autosave-box';
import { IconCopyButton } from '@/components/workflow/icon-copy-button';
import type { ApplicationEvidence, ApplicationKeyword, ApplicationResume, PipelineJob } from '@/types';

function downloadText(content: string, filename: string) { const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }

export default function DocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<PipelineJob | null>(null);
  const [resume, setResume] = useState<ApplicationResume | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [promptText, setPromptText] = useState('');

  useEffect(() => { (async () => {
    const jobRes = await fetch(`/api/jobs/${id}`, { cache:'no-store' }); const jobPayload = await jobRes.json(); setJob(jobPayload.data);
    const appId = jobPayload.data?.application_id; if (!appId) return;
    const [evidenceRes, keywordsRes, resumeRes] = await Promise.all([ fetch(`/api/application-evidence?application_id=${appId}`), fetch(`/api/application-keywords?application_id=${appId}`), fetch(`/api/application-resume?application_id=${appId}`) ]);
    const [evidencePayload, keywordsPayload, resumePayload] = await Promise.all([evidenceRes.json(), keywordsRes.json(), resumeRes.json()]);
    const evidenceSummary = (evidencePayload.data ?? []).map((item: ApplicationEvidence) => `- ${item.resume_bullet || item.title}`).join('
'); const keywordSummary = (keywordsPayload.data ?? []).filter((item:ApplicationKeyword)=>item.is_selected && !item.is_hidden).map((item)=>item.keyword).join(', ');
    setPromptText(`Build a tailored resume for ${jobPayload.data?.title} at ${jobPayload.data?.company}.

TARGET KEYWORDS: ${keywordSummary || '[No keywords selected]'}

EVIDENCE:
${evidenceSummary || '[No evidence available yet]'}

Return a polished markdown resume.`);
    setResume(resumePayload.data); setAccepted(resumePayload.data?.is_accepted ?? false);
  })(); }, [id]);
  async function saveResume(edited_content: string, is_accepted = accepted) { if (!job?.application_id) return; const res = await fetch('/api/application-resume', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ application_id: job.application_id, prompt_text: promptText, edited_content, raw_response: edited_content, is_accepted }) }); const payload = await res.json(); if (payload.data) setResume(payload.data); }
  const reviewContent = useMemo(() => resume?.edited_content || resume?.raw_response || '', [resume]);
  if (!job) return <div className="p-4 text-sm text-muted-foreground">Loading resume workspace...</div>;
  return (<div className="space-y-6"><div className="rounded-2xl border border-border bg-card p-4"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-semibold text-foreground">Resume review and approval</p><p className="mt-1 text-sm text-muted-foreground">Draft, review, approve, and prepare the final resume output.</p></div><Link href={`/jobs/${id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">Continue to Cover Letter <ArrowRight className="h-4 w-4" /></Link></div></div><Tabs defaultValue="prompt" className="space-y-4"><TabsList className="grid grid-cols-3 rounded-xl border border-border bg-black/20 p-1"><TabsTrigger value="prompt">Prompt</TabsTrigger><TabsTrigger value="draft">Draft</TabsTrigger><TabsTrigger value="review">Review</TabsTrigger></TabsList><TabsContent value="prompt"><div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4"><IconCopyButton text={promptText} className="h-12 w-12" /><pre className="max-h-96 flex-1 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">{promptText}</pre></div></TabsContent><TabsContent value="draft"><AutosaveBox value={resume?.edited_content ?? resume?.raw_response ?? ''} onChange={(value)=>setResume((prev)=>prev ? { ...prev, edited_content: value, raw_response: value } : { id:'', application_id: job.application_id!, user_id:'', prompt_text: promptText, raw_response:value, edited_content:value, is_locked:false, is_accepted:false, accepted_at:null, version:1, created_at:new Date().toISOString(), updated_at:new Date().toISOString() })} onAutosave={(value)=>saveResume(value)} rows={18} placeholder="Paste or edit the final resume markdown here..." /></TabsContent><TabsContent value="review" className="space-y-4"><div className="rounded-2xl border border-border bg-card p-4"><pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">{reviewContent || 'No resume content saved yet.'}</pre></div><label className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground"><input type="checkbox" checked={accepted} onChange={async (e)=>{ setAccepted(e.target.checked); await saveResume(resume?.edited_content ?? resume?.raw_response ?? '', e.target.checked); await fetch(`/api/jobs/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ application_stage:'cover_letter', application_cover_letter_started_at:new Date().toISOString() }) }); }} /><span className="inline-flex items-center gap-2"><CheckSquare className="h-4 w-4 text-primary" />Mark resume accepted</span></label><div className="flex flex-wrap gap-2"><button type="button" disabled={!accepted || !reviewContent} onClick={()=>navigator.clipboard.writeText(reviewContent)} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40"><Copy className="h-4 w-4" />Copy</button><button type="button" disabled={!accepted || !reviewContent} onClick={()=>downloadText(reviewContent, `${job.company}-${job.title}-resume.md`.replace(/\s+/g,'-').toLowerCase())} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40"><Download className="h-4 w-4" />Download</button></div></TabsContent></Tabs></div>);
}
