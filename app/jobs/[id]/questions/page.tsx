'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, EyeOff, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AutosaveBox } from '@/components/workflow/autosave-box';
import { buildKeywordsAndQuestions } from '@/lib/research-workflow';
import type { ApplicationAnswer, ApplicationQuestion, ApplicationKeyword, JobListingResearch, PipelineJob } from '@/types';

export default function QuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<PipelineJob | null>(null);
  const [research, setResearch] = useState<JobListingResearch | null>(null);
  const [keywords, setKeywords] = useState<ApplicationKeyword[]>([]);
  const [questions, setQuestions] = useState<ApplicationQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, ApplicationAnswer>>({});

  useEffect(() => { (async () => {
    const [jobRes, researchRes] = await Promise.all([ fetch(`/api/jobs/${id}`, { cache:'no-store' }), fetch(`/api/job-listing-research?job_listing_id=${id}`, { cache:'no-store' }) ]);
    const jobPayload = await jobRes.json(); const researchPayload = await researchRes.json();
    setJob(jobPayload.data); setResearch(researchPayload.data);
    const applicationId = jobPayload.data?.application_id; if (!applicationId) return;
    const [kwRes, qRes, aRes] = await Promise.all([ fetch(`/api/application-keywords?application_id=${applicationId}`), fetch(`/api/application-questions?application_id=${applicationId}`), fetch(`/api/application-answers?application_id=${applicationId}`) ]);
    const [kwPayload, qPayload, aPayload] = await Promise.all([kwRes.json(), qRes.json(), aRes.json()]);
    const derived = buildKeywordsAndQuestions({ parsed_job: researchPayload.data?.parsed_job || {} });
    const keywordRows = (kwPayload.data ?? []).length ? kwPayload.data : await (await fetch('/api/application-keywords', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(derived.keywords.map((keyword:string)=>({ application_id: applicationId, keyword, category:'other', origin_type:'research' }))) })).json().then((p)=>p.data ?? []);
    const questionRows = (qPayload.data ?? []).length ? qPayload.data : await (await fetch('/api/application-questions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(derived.questions.map((q:any, index:number)=>({ application_id: applicationId, question_key:q.question_key, question_text:q.question_text, question_type:q.question_type, guidance:q.guidance, sort_order:index }))) })).json().then((p)=>p.data ?? []);
    setKeywords(keywordRows); setQuestions(questionRows);
    const answerMap: Record<string, ApplicationAnswer> = {}; (aPayload.data ?? []).forEach((a:ApplicationAnswer)=>{ answerMap[a.application_question_id]=a; }); setAnswers(answerMap);
  })(); }, [id]);

  const visibleKeywords = keywords.filter((item) => !item.is_hidden);
  const hiddenKeywords = keywords.filter((item) => item.is_hidden);
  async function updateKeyword(keyword: ApplicationKeyword, is_hidden: boolean) { const res = await fetch('/api/application-keywords', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...keyword, application_id: keyword.application_id, is_hidden }) }); const payload = await res.json(); setKeywords(payload.data ?? []); }
  async function saveAnswer(question: ApplicationQuestion, answer_text: string) { if (!job?.application_id) return; const res = await fetch('/api/application-answers', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ application_id: job.application_id, application_question_id: question.id, answer_text, answer_summary: answer_text.slice(0, 180), is_complete: !!answer_text.trim() }) }); const payload = await res.json(); if (payload.data) setAnswers((prev)=>({ ...prev, [question.id]: payload.data })); }

  if (!job) return <div className="p-4 text-sm text-muted-foreground">Loading context...</div>;
  return (<div className="space-y-6"><div className="rounded-2xl border border-border bg-card p-4"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-semibold text-foreground">Keywords + Q&A</p><p className="mt-1 text-sm text-muted-foreground">Use the strongest keywords, hide weak ones, and answer reusable proof questions.</p></div><Link href={`/jobs/${id}/evidence`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">Continue to Evidence <ArrowRight className="h-4 w-4" /></Link></div></div><div className="rounded-2xl border border-border bg-card p-4"><div className="mb-4 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-foreground">Target keywords</p><p className="text-xs text-muted-foreground">Keywords are autosaved to the current application.</p></div>{hiddenKeywords.length > 0 ? <Dialog><DialogTrigger asChild><button type="button" className="text-xs font-medium text-primary hover:text-primary/80">View hidden keywords</button></DialogTrigger><DialogContent className="border-border bg-background text-foreground"><DialogHeader><DialogTitle>Hidden keywords</DialogTitle></DialogHeader><div className="space-y-2">{hiddenKeywords.map((item)=><div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2"><span className="text-sm text-muted-foreground">{item.keyword}</span><button type="button" onClick={()=>updateKeyword(item,false)} className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium text-foreground hover:border-primary/30 hover:text-primary"><RotateCcw className="h-3 w-3" />Unhide</button></div>)}</div></DialogContent></Dialog> : null}</div><div className="flex flex-wrap gap-2">{visibleKeywords.map((keyword)=><div key={keyword.id} className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm text-primary"><span>{keyword.keyword}</span><button type="button" onClick={()=>updateKeyword(keyword,true)} className="text-primary/70 hover:text-primary"><EyeOff className="h-3.5 w-3.5" /></button></div>)}</div></div><div className="space-y-4">{questions.map((question)=><div key={question.id} className="rounded-2xl border border-border bg-card p-4"><div className="mb-3 flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-foreground">{question.question_text}</p><p className="mt-1 text-xs text-muted-foreground">{question.guidance || 'Use one focused story with scope, action, and measurable result.'}</p></div></div><AutosaveBox value={answers[question.id]?.answer_text ?? ''} onChange={(value)=>setAnswers((prev)=>({ ...prev, [question.id]: { ...(prev[question.id] || { id:'', application_id: job.application_id!, user_id:'', application_question_id: question.id, source_user_answer_id:null, is_reused:false, answer_text:'', answer_summary:'', word_count:0, is_complete:false, notes:'', created_at:new Date().toISOString(), updated_at:new Date().toISOString() }), answer_text:value } }))} onAutosave={(value)=>saveAnswer(question, value)} rows={5} placeholder="Write the answer you want to turn into resume-grade evidence..." /></div>)}</div></div>);
}
