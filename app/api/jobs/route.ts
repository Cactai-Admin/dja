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
});

export async function GET() {
  const { data, error } = await supabase
    .from('pipeline_job_listing_state')
    .select('*')
    .order('job_listing_added_at', { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: (data ?? []).map((row: any) => ({ ...row, id: row.job_listing_id })),
    error: null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const parsed = CreateSchema.safeParse(await req.json());

    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const user_id = getDevUserId();
    const now = new Date().toISOString();

    const listingPayload = {
      user_id,
      title: parsed.data.title,
      company: parsed.data.company,
      location: parsed.data.location,
      type: parsed.data.type,
      compensation: parsed.data.compensation,
      url: parsed.data.url,
      raw_description: parsed.data.raw_description,
      parsed_requirements: parsed.data.parsed_requirements,
      notes: parsed.data.notes,
      metadata: {},
      job_listing_added_at: now,
      job_listing_recommended_at: null,
      job_listing_removed_at: null,
      job_listing_last_checked_at: null,
      job_listing_won_at: null,
      job_listing_lost_at: null,
      job_listing_ghosted_at: null,
    };

    const { data: listing, error: listingError } = await supabase
      .from('job_listings')
      .insert(listingPayload)
      .select()
      .single();

    if (listingError) {
      return NextResponse.json({ data: null, error: listingError.message }, { status: 400 });
    }

    const applicationPayload = {
      user_id,
      job_listing_id: listing.id,
      application_stage: 'research',
      notes: '',
      metadata: {},
      application_research_started_at: now,
      application_questions_started_at: null,
      application_evidence_started_at: null,
      application_resume_started_at: null,
      application_cover_letter_started_at: null,
      application_completed_at: null,
      application_sent_at: null,
      application_received_at: null,
      application_interviewing_at: null,
      application_offer_at: null,
      application_negotiating_at: null,
    };

    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert(applicationPayload)
      .select()
      .single();

    if (applicationError) {
      return NextResponse.json(
        { data: null, error: applicationError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: {
          ...listing,
          application_id: application.id,
          application_stage: application.application_stage,
          pipeline_stage: 'preparing',
        },
        error: null,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}