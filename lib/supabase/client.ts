/* ============================================================
   Supabase — Browser Client (singleton)
   ============================================================ */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dev-anon-key';

let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return client;
}

export const supabase = getSupabaseBrowserClient();
