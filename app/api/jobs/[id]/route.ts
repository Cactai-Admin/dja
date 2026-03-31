import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

const supabase = getSupabaseClient();

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase.from('job_listings').select('*').eq('job_listing_id', params.id).maybeSingle();
  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 404 });
  return NextResponse.json({ data: data ? { ...data, id: data.job_listing_id } : null, error: null });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const listingUpdates: Record<string, unknown> = {};
    const applicationUpdates: Record<string, unknown> = {};
    const listingKeys = ['title','company','location','type','compensation','url','raw_description','parsed_requirements','notes','metadata','job_listing_recommended_at','job_listing_added_at','job_listing_removed_at','job_listing_last_checked_at','job_listing_won_at','job_listing_lost_at','job_listing_ghosted_at'];
    const applicationKeys = ['application_stage','application_research_started_at','application_questions_started_at','application_evidence_started_at','application_resume_started_at','application_cover_letter_started_at','application_completed_at','application_sent_at','application_received_at','application_interviewing_at','application_offer_at','application_negotiating_at'];
    for (const [k,v] of Object.entries(body)) { if (listingKeys.includes(k)) listingUpdates[k]=v; if (applicationKeys.includes(k)) applicationUpdates[k]=v; }
    let listingData:any = null; let applicationData:any = null;
    if (Object.keys(listingUpdates).length) {
      const res = await supabase.from('job_listings').update({ ...listingUpdates, updated_at: new Date().toISOString() }).eq('id', params.id).select().single();
      if (res.error) return NextResponse.json({ data: null, error: res.error.message }, { status: 400 });
      listingData = res.data;
    }
    if (Object.keys(applicationUpdates).length) {
      const res = await supabase.from('applications').update({ ...applicationUpdates, updated_at: new Date().toISOString() }).eq('job_listing_id', params.id).select().single();
      if (res.error) return NextResponse.json({ data: null, error: res.error.message }, { status: 400 });
      applicationData = res.data;
    }
    return NextResponse.json({ data: { listing: listingData, application: applicationData }, error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('job_listings').delete().eq('id', params.id);
  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  return NextResponse.json({ data: { id: params.id }, error: null });
}
