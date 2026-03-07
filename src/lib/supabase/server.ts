/**
 * Server-side Supabase client (service role).
 *
 * WARNING: Uses the SERVICE ROLE KEY — BYPASSES Row Level Security.
 * Only import from:
 *   - Next.js API routes (src/app/api/**)
 *   - Server Actions
 *   - Background scripts
 *
 * NEVER import from client components or any file that could
 * be bundled into the client bundle.
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase server client using the service role key.
 * Env vars are validated at call time, not module load time,
 * to avoid build-time failures when running `next build`.
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || url.startsWith("placeholder")) {
    throw new Error(
      "[CaseMap] NEXT_PUBLIC_SUPABASE_URL is not set. Add it to .env.local."
    );
  }

  if (!key || key.startsWith("placeholder")) {
    throw new Error(
      "[CaseMap] SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
