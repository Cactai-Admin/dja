import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'http://127.0.0.1:54321';
const fallbackAnonKey = 'dev-anon-key';

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackAnonKey
  );
}

export function getDevUserId() {
  return process.env.NEXT_PUBLIC_DEV_USER_ID || '00000000-0000-0000-0000-000000000001';
}
