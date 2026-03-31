import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({ url: z.string().url() });

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
function extractTitle(html: string) {
  return html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
    || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    || '';
}
function inferCompany(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '').split('.')[0]?.replace(/[-_]/g,' ') || ''; } catch { return ''; }
}
function parseRequirements(text: string) {
  const lines = text.split(/[.\n]/).map((s) => s.trim()).filter(Boolean);
  const take = (regex: RegExp) => lines.filter((l) => regex.test(l)).slice(0, 12);
  const experienceMatch = text.match(/(\d+)\+?\s+years?\s+of\s+experience/i);
  return {
    experience: experienceMatch ? [`${experienceMatch[1]}+ years of experience`] : take(/years? of experience|experience with|background in/i),
    technologies: take(/api|python|typescript|react|next\.js|postgres|supabase|aws|gcp|azure|sql/i),
    tools: take(/jira|figma|github|notion|slack|tableau|excel|amplitude|mixpanel/i),
    skills: take(/skill|ability to|strong|communication|leadership|strategy|execution/i),
    education: take(/bachelor|master|degree|mba|phd/i),
  };
}

export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ data:null,error:parsed.error.errors[0]?.message }, {status:400});
    const response = await fetch(parsed.data.url, { headers: { 'User-Agent': 'Mozilla/5.0 DreamJob/1.0', Accept: 'text/html,application/xhtml+xml' }, cache: 'no-store' });
    if (!response.ok) return NextResponse.json({ data:null,error:`Failed to fetch listing: ${response.status}` }, {status:400});
    const html = await response.text();
    const text = stripHtml(html);
    return NextResponse.json({ data: { title: extractTitle(html), company: inferCompany(parsed.data.url), location: '', raw_description: text, parsed_requirements: parseRequirements(text) }, error: null });
  } catch {
    return NextResponse.json({ data:null,error:'Unable to import listing from URL' }, {status:500});
  }
}
