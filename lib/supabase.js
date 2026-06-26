import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase belum di-setup. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di file .env.local'
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Supabase belum di-setup. Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di file .env.local'
    );
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

// Lazy initialization supaya tidak crash saat build tanpa env
let _supabase = null;
let _supabaseAdmin = null;

export const supabase = new Proxy({}, {
  get(_, prop) {
    if (!_supabase) _supabase = createSupabaseClient();
    return _supabase[prop];
  },
});

export const supabaseAdmin = new Proxy({}, {
  get(_, prop) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdmin();
    return _supabaseAdmin[prop];
  },
});
