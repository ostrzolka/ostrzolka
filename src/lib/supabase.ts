import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.NEXT_PUBLIC_PROJECT_ID}.supabase.co`;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Public client — respects RLS. Use for client-side or user-scoped requests. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-only admin client — bypasses RLS using the service role key.
 * NEVER expose this to the browser.
 */
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);
