import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseClient, getDevUserId } from '@/lib/supabase';

const supabase = getSupabaseClient();

const Schema = z.object({
  id: z.string().optional(),
  application_id: z.string().min(1),
  keyword: z.string().min(1),
  category: z.string().optional().default('other'),
  origin_type: z.string().optional().default('research'),
  origin_user_keyword_id: z.string().nullable().optional(),
  is_reused: z.boolean().optional().default(false),
  is_hidden: z.boolean().optional().default(false),
  is_selected: z.boolean().optional().default(true),
  notes: z.string().optional().default(''),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const application_id = searchParams.get('application_id');

  if (!application_id) {
    return NextResponse.json({ data: [], error: 'application_id required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('application_keywords')
    .select('*')
    .eq('application_id', application_id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], error: null });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];
    const parsed = z.array(Schema).safeParse(items);

    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const rows = parsed.data.map(({ id, ...row }) => ({
      ...row,
      id,
      user_id: getDevUserId(),
      updated_at: new Date().toISOString(),
    }));

    if (rows.length === 0) {
      return NextResponse.json({ data: [], error: null });
    }

    const { error } = await supabase.from('application_keywords').upsert(rows, {
      onConflict: 'application_id,keyword',
    });

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, { status: 400 });
    }

    const { data, error: refreshError } = await supabase
      .from('application_keywords')
      .select('*')
      .eq('application_id', rows[0].application_id)
      .order('updated_at', { ascending: false });

    if (refreshError) {
      return NextResponse.json({ data: null, error: refreshError.message }, { status: 400 });
    }

    return NextResponse.json({ data: data ?? [], error: null });
  } catch {
    return NextResponse.json({ data: null, error: 'Internal server error' }, { status: 500 });
  }
}
