import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const supabase = getSupabaseClient();

const listingKeys = [
  'title',
  'company',
  'location',
  'type',
  'compensation',
  'url',
  'raw_description',
  'parsed_requirements',
  'notes',
  'metadata',
  'job_listing_recommended_at',
  'job_listing_added_at',
  'job_listing_removed_at',
  'job_listing_last_checked_at',
  'job_listing_won_at',
  'job_listing_lost_at',
  'job_listing_ghosted_at',
];

const applicationKeys = [
  'application_stage',
  'application_research_started_at',
  'application_questions_started_at',
  'application_evidence_started_at',
  'application_resume_started_at',
  'application_cover_letter_started_at',
  'application_completed_at',
  'application_sent_at',
  'application_received_at',
  'application_interviewing_at',
  'application_offer_at',
  'application_negotiating_at',
];

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*, applications(id, application_stage)')
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 404 });
  }

  const application = Array.isArray((data as any)?.applications)
    ? (data as any).applications[0]
    : (data as any)?.applications;

  return NextResponse.json({
    data: data
      ? {
          ...data,
          id: data.id,
          application_id: application?.id ?? null,
          application_stage: application?.application_stage ?? null,
        }
      : null,
    error: null,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const updates = Object.entries(body).reduce(
      (acc, [key, value]) => {
        if (listingKeys.includes(key)) acc.listing[key] = value;
        if (applicationKeys.includes(key)) acc.application[key] = value;
        return acc;
      },
      {
        listing: {} as Record<string, unknown>,
        application: {} as Record<string, unknown>,
      }
    );

    let listingData: any = null;
    let applicationData: any = null;

    if (Object.keys(updates.listing).length > 0) {
      const result = await supabase
        .from('job_listings')
        .update({ ...updates.listing, updated_at: new Date().toISOString() })
        .eq('id', params.id)
        .select()
        .single();

      if (result.error) {
        return NextResponse.json({ data: null, error: result.error.message }, { status: 400 });
      }

      listingData = result.data;
    }

    if (Object.keys(updates.application).length > 0) {
      const result = await supabase
        .from('applications')
        .update({ ...updates.application, updated_at: new Date().toISOString() })
        .eq('job_listing_id', params.id)
        .select()
        .single();

      if (result.error) {
        return NextResponse.json({ data: null, error: result.error.message }, { status: 400 });
      }

      applicationData = result.data;
    }

    return NextResponse.json({ data: { listing: listingData, application: applicationData }, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('job_listings').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: { id: params.id }, error: null });
}
