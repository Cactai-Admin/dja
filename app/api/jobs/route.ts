import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseClient, getDevUserId } from '@/lib/supabase';

const supabase = getSupabaseClient();
const CreateSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional().default(''),
  type: z.string().optional().default('full_time'),
  compensation: z.string().optional().default(''),
  url: z.string().optional().default(''),
  raw_description: z.string().optional().default(''),
  parsed_requirements: z.record(z.unknown()).optional().default({}),
  notes: z.string().optional().default(''),
  recommended: z.boolean().optional().default(false),
});

export async function GET() {
  const { data, error } = await supabase.from('pipeline_job_listing_state').select('*').order('job_listing_added_at', { ascending: false, nullsFirst: false });
  if (error) return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  return NextResponse.json({ data: (data ?? []).map((row:any)=>({ ...row, id: row.job_listing_id })), error: null });
}

export async function POST(req: NextRequest) {
  try {
    const parsed = CreateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.errors[0]?.message }, { status: 400 });
    const user_id = getDevUserId();
    const now = new Date().toISOString();
    const listingPayload = { ...parsed.data, user_id, job_listing_added_at: now, job_listing_recommended_at: parsed.data.recommended ? now : null };
    const { data: listing, error: listingError } = await supabase.from('job_listings').insert(listingPayload).select().single();
    if (listingError) return NextResponse.json({ data: null, error: listingError.message }, { status: 400 });
    const applicationPayload = { user_id, job_listing_id: listing.id, application_stage: 'research', application_research_started_at: now, notes: '', metadata: {} };
    const { data: application, error: applicationError } = await supabase.from('applications').insert(applicationPayload).select().single();
    if (applicationError) return NextResponse.json({ data: null, error: applicationError.message }, { status: 400 });
    return NextResponse.json({ data: { ...listing, application_id: application.id, application_stage: application.application_stage, pipeline_stage: 'preparing' }, error: null }, { status: 201 });
  } catch {
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
