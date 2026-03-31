export function buildUnifiedResearchPrompt(input: {
  title: string;
  company: string;
  location?: string;
  url?: string;
  rawDescription: string;
}) {
  return `Use the job listing information below as the primary source of truth. Research the job, company, and team in one pass.

JOB TITLE: ${input.title}
COMPANY: ${input.company}
LOCATION: ${input.location || 'Unknown'}
SOURCE URL: ${input.url || 'Not provided'}

LISTING DESCRIPTION:
${input.rawDescription || '[No listing description provided]'}

RESEARCH INSTRUCTIONS:
- identify role requirements, tools, technologies, methods, education, and experience
- identify company culture, priorities, recent news, and profile links
- identify recruiter and hiring-manager signals, likely org structure, and relevant connection paths

OUTPUT INSTRUCTIONS:
Return one markdown block with three sections only:
# Job
# Company
# Team
Use bullets and include links where available.`;
}

function unique(arr: string[]) {
  return Array.from(new Set(arr.filter(Boolean)));
}

export function parseUnifiedResearch(raw: string) {
  const sections = { job: '', company: '', team: '' } as Record<string, string>;
  const regex = /#\s*(Job|Company|Team)\s*([\s\S]*?)(?=\n#\s*(Job|Company|Team)\b|$)/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw))) {
    sections[match[1].toLowerCase()] = match[2].trim();
  }

  const splitLines = (text: string) =>
    text
      .split(/\n+/)
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);

  const findBy = (lines: string[], words: RegExp) => unique(lines.filter((line) => words.test(line)));
  const jobLines = splitLines(sections.job);
  const companyLines = splitLines(sections.company);
  const teamLines = splitLines(sections.team);

  return {
    parsed_job: {
      keywords: unique(jobLines.filter((line) => /keyword|skill|technology|tool|experience|education|method/i.test(line))),
      required_skills: findBy(jobLines, /skill|ability|competenc/i),
      required_technologies: findBy(jobLines, /react|typescript|python|api|sql|aws|gcp|azure|supabase|postgres/i),
      required_tools: findBy(jobLines, /figma|jira|notion|slack|github|tableau|amplitude|mixpanel|excel/i),
      required_experience: findBy(jobLines, /experience|years/i),
      required_education: findBy(jobLines, /degree|bachelor|master|mba|phd|education/i),
    },
    parsed_company: {
      cultural_fit_criteria: findBy(companyLines, /culture|value|fit|expect/i),
      recent_news: findBy(companyLines, /news|launch|announce|fund|release|recent/i),
      social_profile_urls: unique(sections.company.match(/https?:\/\/\S+/g) || []),
    },
    parsed_team: {
      resume_signals: findBy(teamLines, /resume|cover letter|signal|looking for|must show/i),
      org_map: findBy(teamLines, /team|manager|recruiter|department|org|report/i),
      linkedin_urls: unique(sections.team.match(/https?:\/\/\S+/g) || []),
      network_connections: findBy(teamLines, /1st|2nd|connection|network|linkedin/i),
    },
  };
}

export function buildKeywordsAndQuestions(parsed: any) {
  const rawKeywords = [
    ...(parsed?.parsed_job?.keywords || []),
    ...(parsed?.parsed_job?.required_skills || []),
    ...(parsed?.parsed_job?.required_technologies || []),
    ...(parsed?.parsed_job?.required_tools || []),
  ];

  const keywords = unique(
    rawKeywords
      .flatMap((item: string) => item.split(/,|;/).map((v) => v.trim()))
      .filter(Boolean)
  );

  const questions = keywords.slice(0, 8).map((keyword, index) => ({
    question_key: `q-${index + 1}-${keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    question_text: `Tell me about a time you demonstrated ${keyword} in a way that produced measurable business value.`,
    question_type: index < 5 ? 'behavioral' : 'technical',
    target_keywords: [keyword],
    importance_rank: index + 1,
    guidance: `Use a concise STAR story. Show ownership, decisions, tools, and measurable outcomes connected to ${keyword}.`,
  }));

  return { keywords, questions };
}

export function buildEvidencePrompt(args: {
  title: string;
  company: string;
  answers: string;
  keywords: string[];
}) {
  return `Transform the candidate answers below into resume-ready evidence for ${args.title} at ${args.company}.

TARGET KEYWORDS:
- ${args.keywords.join('\n- ')}

CANDIDATE ANSWERS:
${args.answers || '[No answers yet]'}

Return markdown bullets grouped under # Evidence Units with title, resume bullet, tools, technologies, skills, metrics, and supporting STAR notes.`;
}
