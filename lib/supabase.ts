import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client-side Supabase client.
 *
 * Uses `createBrowserClient` from `@supabase/ssr` so the session is stored in
 * **HTTP cookies** rather than localStorage.  This is critical because the
 * middleware (`middleware.ts`) reads the session from `req.cookies` via
 * `createServerClient` from the same package.  If the client stored the
 * session only in localStorage (the default for plain `createClient` from
 * `@supabase/supabase-js`), the middleware would never see it and would
 * redirect authenticated partners away from protected routes like `/business/*`.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = supabase !== null;
