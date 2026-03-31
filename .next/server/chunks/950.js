"use strict";exports.id=950,exports.ids=[950],exports.modules={950:(e,r,t)=>{function o(e){return`Use the job listing information below as the primary source of truth. Research the job, company, and team in one pass.

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
Use bullets and include links where available.`}function i(e){return Array.from(new Set(e.filter(Boolean)))}t.d(r,{AR:()=>o,U3:()=>s,Wo:()=>n,hw:()=>a,qc:()=>l});let n=[{key:"job",label:"Job",icon:"briefcase",fields:["keywords","required_skills","required_technologies","required_tools","required_experience","required_education","guidance"]},{key:"company",label:"Company",icon:"building",fields:["culture","recent_news","news_links","social_urls"]},{key:"team",label:"Team",icon:"users",fields:["resume_signals","cover_letter_signals","org_map","linkedin_urls","network_connections"]}];function s(e){let r;let t={job:"",company:"",team:""},o=/#\s*(Job|Company|Team)\s*([\s\S]*?)(?=\n#\s*(Job|Company|Team)\b|$)/gi;for(;r=o.exec(e);)t[r[1].toLowerCase()]=r[2].trim();let n=e=>e.split(/\n+/).map(e=>e.replace(/^[-*]\s*/,"").trim()).filter(Boolean),s=(e,r)=>i(e.filter(e=>r.test(e))),a=n(t.job),l=n(t.company),c=n(t.team);return{parsed_job:{keywords:i(a.filter(e=>/keyword|skill|technology|tool|experience|education|method/i.test(e))),required_skills:s(a,/skill|ability|competenc/i),required_technologies:s(a,/react|typescript|python|api|sql|aws|gcp|azure|supabase|postgres/i),required_tools:s(a,/figma|jira|notion|slack|github|tableau|amplitude|mixpanel|excel/i),required_experience:s(a,/experience|years/i),required_education:s(a,/degree|bachelor|master|mba|phd|education/i)},parsed_company:{cultural_fit_criteria:s(l,/culture|value|fit|expect/i),recent_news:s(l,/news|launch|announce|fund|release|recent/i),social_profile_urls:i(t.company.match(/https?:\/\/\S+/g)||[])},parsed_team:{resume_signals:s(c,/resume|cover letter|signal|looking for|must show/i),org_map:s(c,/team|manager|recruiter|department|org|report/i),linkedin_urls:i(t.team.match(/https?:\/\/\S+/g)||[]),network_connections:s(c,/1st|2nd|connection|network|linkedin/i)}}}function a(e){let r=[...e?.parsed_job?.keywords||[],...e?.parsed_job?.required_skills||[],...e?.parsed_job?.required_technologies||[],...e?.parsed_job?.required_tools||[]],t=i(r.flatMap(e=>e.split(/,|;/).map(e=>e.trim())).filter(Boolean)),o=t.slice(0,8).map((e,r)=>({question_key:`q-${r+1}-${e.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,question_text:`Tell me about a time you demonstrated ${e} in a way that produced measurable business value.`,question_type:r<5?"behavioral":"technical",target_keywords:[e],importance_rank:r+1,guidance:`Use a concise STAR story. Show ownership, decisions, tools, and measurable outcomes connected to ${e}.`}));return{keywords:t,questions:o}}function l(e){return`Transform the candidate answers below into resume-ready evidence for ${e.title} at ${e.company}.

TARGET KEYWORDS:
- ${e.keywords.join("\n- ")}

CANDIDATE ANSWERS:
${e.answers||"[No answers yet]"}

Return markdown bullets grouped under # Evidence Units with title, resume bullet, tools, technologies, skills, metrics, and supporting STAR notes.`}}};