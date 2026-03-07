/**
 * Browser (client-side) Supabase client.
 *
 * Uses the anon key and respects Row Level Security (RLS) policies.
 * This client is safe to use in React components, hooks, and client-side code.
 *
 * For server-side queries that need to bypass RLS, use the server client
 * at @/lib/supabase/server — but NEVER import that from client components.
 *
 * NOTE: @supabase/ssr is not yet installed. Install with:
 *   pnpm add @supabase/ssr @supabase/supabase-js
 * Then remove the stub below and uncomment the real implementation.
 */

// import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error(
    "[CaseMap] NEXT_PUBLIC_SUPABASE_URL is not set. " +
      "Add it to .env.local — see .env.example for details."
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    "[CaseMap] NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. " +
      "Add it to .env.local — see .env.example for details."
  );
}

/**
 * Creates a Supabase browser client instance.
 * Uses the public anon key — all queries are subject to RLS policies.
 *
 * Call this function within client components or hooks (not at module level,
 * to avoid issues with Next.js SSR and React Server Components).
 *
 * @example
 * const supabase = createSupabaseBrowserClient();
 * const { data } = await supabase.from("courts").select("*");
 */
// Phase 0 stub — replace with real implementation in Phase 1 after installing @supabase/ssr
export function createSupabaseBrowserClient() {
  // return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  throw new Error(
    "[CaseMap] Supabase client not yet initialized. " +
      "Install @supabase/ssr and uncomment the real implementation in src/lib/supabase/client.ts"
  );
}
