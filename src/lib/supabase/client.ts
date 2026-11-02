import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient) return browserClient;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
    return browserClient;
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err);
    return null;
  }
}

