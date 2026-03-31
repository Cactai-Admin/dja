"use strict";exports.id=950,exports.ids=[950],exports.modules={950:(e,t,r)=>{function o(e){return`Use the job listing information below as the primary source of truth. Research the job, company, and team in one pass.

JOB TITLE: ${e.title}
COMPANY: ${e.company}
LOCATION: ${e.location||"Unknown"}
SOURCE URL: ${e.url||"Not provided"}

LISTING DESCRIPTION:
${e.rawDescription||"[No listing description provided]"}

RESEARCH INSTRUCTIONS:
- identify role requirements, tools, technologies, methods, education, and experience
- identify company culture, priorities, recent news, and profile links
- identify recruiter and hiring-manager signals, likely org structure, and relevant connection paths

OUTPUT INSTRUCTIONS:
Return one markdown block with three sections only:
# Job
# Company
# Team
Use bullets and include links where available.`}function n(e){return Array.from(new Set(e.filter(Boolean)))}function i(e){let t;let r={job:"",company:"",team:""},o=/#\s*(Job|Company|Team)\s*([\s\S]*?)(?=\n#\s*(Job|Company|Team)\b|$)/gi;for(;t=o.exec(e);)r[t[1].toLowerCase()]=t[2].trim();let i=e=>e.split(/\n+/).map(e=>e.replace(/^[-*]\s*/,"").trim()).filter(Boolean),a=(e,t)=>n(e.filter(e=>t.test(e))),s=i(r.job),l=i(r.company),c=i(r.team);return{parsed_job:{keywords:n(s.filter(e=>/keyword|skill|technology|tool|experience|education|method/i.test(e))),required_skills:a(s,/skill|ability|competenc/i),required_technologies:a(s,/react|typescript|python|api|sql|aws|gcp|azure|supabase|postgres/i),required_tools:a(s,/figma|jira|notion|slack|github|tableau|amplitude|mixpanel|excel/i),required_experience:a(s,/experience|years/i),required_education:a(s,/degree|bachelor|master|mba|phd|education/i)},parsed_company:{cultural_fit_criteria:a(l,/culture|value|fit|expect/i),recent_news:a(l,/news|launch|announce|fund|release|recent/i),social_profile_urls:n(r.company.match(/https?:\/\/\S+/g)||[])},parsed_team:{resume_signals:a(c,/resume|cover letter|signal|looking for|must show/i),org_map:a(c,/team|manager|recruiter|department|org|report/i),linkedin_urls:n(r.team.match(/https?:\/\/\S+/g)||[]),network_connections:a(c,/1st|2nd|connection|network|linkedin/i)}}}function a(e){let t=[...e?.parsed_job?.keywords||[],...e?.parsed_job?.required_skills||[],...e?.parsed_job?.required_technologies||[],...e?.parsed_job?.required_tools||[]],r=n(t.flatMap(e=>e.split(/,|;/).map(e=>e.trim())).filter(Boolean)),o=r.slice(0,8).map((e,t)=>({question_key:`q-${t+1}-${e.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,question_text:`Tell me about a time you demonstrated ${e} in a way that produced measurable business value.`,question_type:t<5?"behavioral":"technical",target_keywords:[e],importance_rank:t+1,guidance:`Use a concise STAR story. Show ownership, decisions, tools, and measurable outcomes connected to ${e}.`}));return{keywords:r,questions:o}}function s(e){return`Transform the candidate answers below into resume-ready evidence for ${e.title} at ${e.company}.

TARGET KEYWORDS:
- ${e.keywords.join("\n- ")}

CANDIDATE ANSWERS:
${e.answers||"[No answers yet]"}

Return markdown bullets grouped under # Evidence Units with title, resume bullet, tools, technologies, skills, metrics, and supporting STAR notes.`}r.d(t,{AR:()=>o,U3:()=>i,hw:()=>a,qc:()=>s})}};