import { createClient, SupabaseClient } from '@supabase/supabase-js';

// IMPORTANT: These variables are expected to be set in the environment.
// Do not hard-code them here.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
let supabaseInitializationError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  supabaseInitializationError = "Supabase URL and anonymous key are required. Please set the SUPABASE_URL and SUPABASE_ANON_KEY secrets for this project. You can find these in your Supabase project under Project Settings > API.";
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch(e: any) {
    supabaseInitializationError = `Error initializing Supabase client: ${e.message}`;
    console.error(e);
  }
}

export { supabase, supabaseInitializationError };
