npm run build

> nextjs@0.1.0 build
> next build

Failed to compile.

./app/jobs/[id]/documents/page.tsx
NonErrorEmittedError: (Emitted value instead of an instance of Error) 
  x Unterminated string constant
    ,-[/home/project/app/jobs/[id]/documents/page.tsx:22:1]
 22 |     const appId = jobPayload.data?.application_id; if (!appId) return;
 23 |     const [evidenceRes, keywordsRes, resumeRes] = await Promise.all([ fetch(`/api/application-evidence?application_id=${appId}`), fetch(`/api/application-keywords?application_id=${appId}`), fetch(`/api/application-resume?application_id=${appId}`) ]);
 24 |     const [evidencePayload, keywordsPayload, resumePayload] = await Promise.all([evidenceRes.json(), keywordsRes.json(), resumeRes.json()]);
 25 |     const evidenceSummary = (evidencePayload.data ?? []).map((item: ApplicationEvidence) => `- ${item.resume_bullet || item.title}`).join('
    :                                                                                                                                           ^
 26 | '); const keywordSummary = (keywordsPayload.data ?? []).filter((item:ApplicationKeyword)=>item.is_selected && !item.is_hidden).map((item)=>item.keyword).join(', ');
 27 |     setPromptText(`Build a tailored resume for ${jobPayload.data?.title} at ${jobPayload.data?.company}.
    `----

  x Expected ',', got 'string literal (); const keywordSummary = (keywordsPayload.data ?? []).filter((item:ApplicationKeyword)=>item.is_selected && !item.is_hidden).map((item)=>item.keyword).join(,
  | '); const keywordSummary = (keywordsPayload.data ?? []).filter((item:ApplicationKeyword)=>item.is_selected && !item.is_hidden).map((item)=>item.keyword).join(')'
    ,-[/home/project/app/jobs/[id]/documents/page.tsx:23:1]
 23 |     const [evidenceRes, keywordsRes, resumeRes] = await Promise.all([ fetch(`/api/application-evidence?application_id=${appId}`), fetch(`/api/application-keywords?application_id=${appId}`), fetch(`/api/application-resume?application_id=${appId}`) ]);
 24 |     const [evidencePayload, keywordsPayload, resumePayload] = await Promise.all([evidenceRes.json(), keywordsRes.json(), resumeRes.json()]);
 25 |     const evidenceSummary = (evidencePayload.data ?? []).map((item: ApplicationEvidence) => `- ${item.resume_bullet || item.title}`).join('
 26 | '); const keywordSummary = (keywordsPayload.data ?? []).filter((item:ApplicationKeyword)=>item.is_selected && !item.is_hidden).map((item)=>item.keyword).join(', ');
    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 27 |     setPromptText(`Build a tailored resume for ${jobPayload.data?.title} at ${jobPayload.data?.company}.
 28 | 
 29 | TARGET KEYWORDS: ${keywordSummary || '[No keywords selected]'}
    `----

Caused by:
    0: failed to process js file
    1: Syntax Error
    at new WebpackError (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:493231)
    at new NonErrorEmittedError (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:391836)
    at processResult (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:398584)
    at eval (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:400370)
    at eval (/home/project/node_modules/next/dist/compiled/loader-runner/LoaderRunner.js:1:8720)
    at eval (/home/project/node_modules/next/dist/compiled/loader-runner/LoaderRunner.js:1:5903)
    at r.callback (/home/project/node_modules/next/dist/compiled/loader-runner/LoaderRunner.js:1:4114)
    at eval (/home/project/node_modules/next/dist/build/webpack/loaders/next-swc-loader.js:185:9)

Import trace for requested module:
./app/jobs/[id]/documents/page.tsx

./app/jobs/[id]/evidence/page.tsx
NonErrorEmittedError: (Emitted value instead of an instance of Error) 
  x Unterminated regexp literal
    ,-[/home/project/app/jobs/[id]/evidence/page.tsx:10:1]
 10 | import type { ApplicationAnswer, ApplicationEvidence, ApplicationKeyword, PipelineJob } from '@/types';
 11 | 
 12 | function parseEvidence(raw: string, applicationId: string, answers: ApplicationAnswer[]) {
 13 |   const chunks = raw.split(/
    :                            ^
 14 | ##\s+/).map((part) => part.trim()).filter(Boolean);
 15 |   return chunks.map((chunk, index) => ({ application_id: applicationId, title: chunk.split('
 16 | ')[0]?.replace(/^#\s*/, '') || `Evidence ${index + 1}`, resume_bullet: chunk, source_application_answer_id: answers[index]?.id ?? null, company: '', department: '', role: '', dates: '', situation: '', task: '', action: '', result: '', metrics: [], tools: [], technologies: [], skills: [], keywords: [], evidence_type: 'resume_bullet' }));
    `----

Caused by:
    0: failed to process js file
    1: Syntax Error
    at new WebpackError (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:493231)
    at new NonErrorEmittedError (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:391836)
    at processResult (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:398584)
    at eval (/home/project/node_modules/next/dist/compiled/webpack/bundle5.js:28:400370)
    at eval (/home/project/node_modules/next/dist/compiled/loader-runner/LoaderRunner.js:1:8720)
    at eval (/home/project/node_modules/next/dist/compiled/loader-runner/LoaderRunner.js:1:5903)
    at r.callback (/home/project/node_modules/next/dist/compiled/loader-runner/LoaderRunner.js:1:4114)
    at eval (/home/project/node_modules/next/dist/build/webpack/loaders/next-swc-loader.js:185:9)

Import trace for requested module:
./app/jobs/[id]/evidence/page.tsx

./app/jobs/[id]/page.tsx
NonErrorEmittedError: (Emitted value instead of an instance of Error) 
  x Unterminated string constant
    ,-[/home/project/app/jobs/[id]/page.tsx:13:1]
 13 | export default function CoverLetterReviewPage() {
 14 |   const { id } = useParams<{ id: string }>(); const router = useRouter();
 15 |   const [job, setJob] = useState<PipelineJob | null>(null); const [draft, setDraft] = useState<ApplicationCoverLetter | null>(null); const [accepted, setAccepted] = useState(false); const [overviewApplied, setOverviewApplied] = useState(false); const [promptText, setPromptText] = useState('');
 16 |   useEffect(() => { (async () => { const jobRes = await fetch(`/api/jobs/${id}`, { cache:'no-store' }); const jobPayload = await jobRes.json(); setJob(jobPayload.data); const appId = jobPayload.data?.application_id; if (!appId) return; const [evidenceRes, coverRes] = await Promise.all([ fetch(`/api/application-evidence?application_id=${appId}`), fetch(`/api/application-cover-letters?application_id=${appId}`) ]); const [evidencePayload, coverPayload] = await Promise.all([evidenceRes.json(), coverRes.json()]); const evidenceSummary = (evidencePayload.data ?? []).map((unit: ApplicationEvidence) => `- ${unit.title}: ${unit.resume_bullet || unit.result}`).join('
    :                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ^
 17 | '); setPromptText(`Write a focused cover letter for ${jobPayload.data?.title} at ${jobPayload.data?.company}.
 18 | 
 19 | Use these evidence units:
    `----

  x Unterminated string constant
    ,-[/home/project/app/jobs/[id]/page.tsx:14:1]
 14 |   const { id } = useParams<{ id: string }>(); const router = useRouter();
 15 |   const [job, setJob] = useState<PipelineJob | null>(null); const [draft, setDraft] = useState<ApplicationCoverLetter | null>(null); const [accepted, setAccepted] = useState(false); const [overviewApplied, setOverviewApplied] = useState(false); const [promptText, setPromptText] = useState('');
 16 |   useEffect(() => { (async () => { const jobRes = await fetch(`/api/jobs/${id}`, { cache:'no-store' }); const jobPayload = await jobRes.json(); setJob(jobPayload.data); const appId = jobPayload.data?.application_id; if (!appId) return; const [evidenceRes, coverRes] = await Promise.all([ fetch(`/api/application-evidence?application_id=${appId}`), fetch(`/api/application-cover-letters?application_id=${appId}`) ]); const [evidencePayload, coverPayload] = await Promise.all([evidenceRes.json(), coverRes.json()]); const evidenceSummary = (evidencePayload.data ?? []).map((unit: ApplicationEvidence) => `- ${unit.title}: ${unit.resume_bullet || unit.result}`).join('
 17 | '); setPromptText(`Write a focused cover letter for ${jobPayload.data?.title} at ${jobPayload.data?.company}.
    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 18 | 
 19 | Use these evidence units:
 20 | ${evidenceSummary || '[No evidence saved]'}
    `----

  x Expected ',', got 'string literal (); setPromptText(`Write a focused cover letter for ${jobPayload.data?.title} at ${jobPayload.data?.company}., '); setPromptText(`Write a focused cover letter
  | for ${jobPayload.data?.title} at ${jobPayload.data?.company}.
  | )'
    ,-[/home/project/app/jobs/[id]/page.tsx:14:1]
 14 |   const { id } = useParams<{ id: string }>(); const router = useRouter();
 15 |   const [job, setJob] = useState<PipelineJob | null>(null); const [draft, setDraft] = useState<ApplicationCoverLetter | null>(null); const [accepted, setAccepted] = useState(false); const [overviewApplied, setOverviewApplied] = useState(false); const [promptText, setPromptText] = useState('');
 16 |   useEffect(() => { (async () => { const jobRes = await fetch(`/api/jobs/${id}`, { cache:'no-store' }); const jobPayload = await jobRes.json(); setJob(jobPayload.data); const appId = jobPayload.data?.application_id; if (!appId) return; const [evidenceRes, coverRes] = await Promise.all([ fetch(`/api/application-evidence?application_id=${appId}`), fetch(`/api/application-cover-letters?application_id=${appId}`) ]); const [evidencePayload, coverPayload] = await Promise.all([evidenceRes.json(), coverRes.json()]); const evidenceSummary = (evidencePayload.data ?? []).map((unit: ApplicationEvidence) => `- ${unit.title}: ${unit.resume_bullet || unit.result}`).join('
 17 | '); setPromptText(`Write a focused cover letter for ${jobPayload.data?.title} at ${jobPayload.data?.company}.
    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 18 | 
 19 | Use these evidence units:
 20 | ${evidenceSummary || '[No evidence saved]'}
    `----
