import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const supabase = getSupabaseClient();

function derivePipelineStage(listing: any, application: any) {
  if (
    listing?.job_listing_won_at ||
    listing?.job_listing_lost_at ||
    listing?.job_listing_ghosted_at
  ) {
    return 'outcome';
  }

  if (
    application?.application_sent_at ||
    application?.application_received_at ||
    application?.application_interviewing_at ||
    application?.application_offer_at ||
    application?.application_negotiating_at
  ) {
    return 'applied';
  }

  if (
    application?.application_research_started_at ||
    application?.application_questions_started_at ||
    application?.application_evidence_started_at ||
    application?.application_resume_started_at ||
    application?.application_cover_letter_started_at ||
    application?.application_completed_at
  ) {
    return 'preparing';
  }

  return 'new';
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data: listing, error: listingError } = await supabase
    .from('job_listings')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (listingError || !listing) {
    return NextResponse.json(
      { data: null, error: listingError?.message || 'Job listing not found' },
      { status: 404 }
    );
  }

  const { data: application, error: applicationError } = await supabase
    .from('applications')
    .select('*')
    .eq('job_listing_id', params.id)
    .maybeSingle();

  if (applicationError) {
    return NextResponse.json(
      { data: null, error: applicationError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: {
      ...listing,
      application_id: application?.id ?? null,
      application_stage: application?.application_stage ?? null,
      pipeline_stage: derivePipelineStage(listing, application),
    },
    error: null,
  });
}