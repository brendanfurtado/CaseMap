/**
 * Server-side Supabase client (service role).
 *
 * WARNING: This client uses the SERVICE ROLE KEY which BYPASSES Row Level Security.
 * Only import this from:
 *   - Next.js API routes (src/app/api/**)
 *   - Server Actions
 *   - Background scripts
 *
 * NEVER import this from client components, hooks, or any file that could
 * be bundled into the client bundle. The service role key must never be
 * exposed to the browser.
 *
 * NOTE: @supabase/supabase-js is not yet installed. Install with:
 *   pnpm add @supabase/ssr @supabase/supabase-js
 * Then remove the stub below and uncomment the real implementation.
 */

// import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    "[CaseMap] NEXT_PUBLIC_SUPABASE_URL is not set. " +
      "Add it to .env.local — see .env.example for details."
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "[CaseMap] SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "This is a server-only secret. Add it to .env.local — see .env.example for details."
  );
}

/**
 * Creates a Supabase server client using the service role key.
 * Bypasses RLS — use only in trusted server-side contexts.
 * Auto-refresh and session persistence are disabled (not needed server-side).
 *
 * @example
 * // In an API route:
 * const supabase = createSupabaseServerClient();
 * const { data } = await supabase.from("courts").select("*");
 */
// Phase 0 stub — replace with real implementation in Phase 1 after installing @supabase/supabase-js
export function createSupabaseServerClient() {
  // return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
  //   auth: {
  //     autoRefreshToken: false,
  //     persistSession: false,
  //   },
  // });
  throw new Error(
    "[CaseMap] Supabase server client not yet initialized. " +
      "Install @supabase/supabase-js and uncomment the real implementation in src/lib/supabase/server.ts"
  );
}
