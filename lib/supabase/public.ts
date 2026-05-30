import { createClient } from "@supabase/supabase-js";

/**
 * Public (unauthenticated) Supabase client for server-side data fetching
 * on pages that don't require user auth (home, products, product detail).
 * Using this instead of the cookie-based client enables static generation / ISR.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
