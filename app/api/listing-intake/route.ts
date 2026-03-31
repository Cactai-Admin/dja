import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({ url: z.string().url() });
const MAX_HTML_LENGTH = 1_000_000;

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
  return (
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
    ''
  );
}

function inferCompany(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').split('.')[0]?.replace(/[-_]/g, ' ') || '';
  } catch {
    return '';
  }
}

function parseRequirements(text: string) {
  const lines = text
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const take = (regex: RegExp) => lines.filter((l) => regex.test(l)).slice(0, 12);
  const experienceMatch = text.match(/(\d+)\+?\s+years?\s+of\s+experience/i);

  return {
    experience: experienceMatch
      ? [`${experienceMatch[1]}+ years of experience`]
      : take(/years? of experience|experience with|background in/i),
    technologies: take(/api|python|typescript|react|next\.js|postgres|supabase|aws|gcp|azure|sql/i),
    tools: take(/jira|figma|github|notion|slack|tableau|excel|amplitude|mixpanel/i),
    skills: take(/skill|ability to|strong|communication|leadership|strategy|execution/i),
    education: take(/bachelor|master|degree|mba|phd/i),
  };
}

function isPrivateIPv4(ip: string) {
  const [a, b] = ip.split('.').map(Number);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 0) return true;
  return false;
}

function isBlockedIp(ip: string) {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);

  if (version === 6) {
    const normalized = ip.toLowerCase();
    return (
      normalized === '::1' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe80:')
    );
  }

  return true;
}

async function assertSafeTarget(targetUrl: string) {
  const parsed = new URL(targetUrl);

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http and https URLs are allowed');
  }

  const host = parsed.hostname.toLowerCase();
  if (host === 'localhost') {
    throw new Error('Localhost targets are not allowed');
  }

  const addresses = await lookup(host, { all: true, verbatim: true });
  if (addresses.length === 0) {
    throw new Error('Unable to resolve URL host');
  }

  if (addresses.some((entry) => isBlockedIp(entry.address))) {
    throw new Error('Target URL resolves to a blocked address');
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    await assertSafeTarget(parsed.data.url);

    const response = await fetch(parsed.data.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 DreamJob/1.0',
        Accept: 'text/html,application/xhtml+xml',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { data: null, error: `Failed to fetch listing: ${response.status}` },
        { status: 400 }
      );
    }

    const contentLength = Number(response.headers.get('content-length') || '0');
    if (contentLength > MAX_HTML_LENGTH) {
      return NextResponse.json(
        { data: null, error: 'Fetched listing is too large to process' },
        { status: 400 }
      );
    }

    const html = (await response.text()).slice(0, MAX_HTML_LENGTH);
    const text = stripHtml(html);

    return NextResponse.json({
      data: {
        title: extractTitle(html),
        company: inferCompany(parsed.data.url),
        location: '',
        raw_description: text,
        parsed_requirements: parseRequirements(text),
      },
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to import listing from URL';
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
