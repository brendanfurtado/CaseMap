import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Court } from "@/types";

// Court data is static — revalidate once per day
export const revalidate = 86400;

/**
 * GET /api/courts
 * Returns all NY courts with geocoded locations.
 * Cached for 24 hours — courts don't move.
 */
export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("courts")
      .select("*")
      .order("name");

    if (error) throw error;

    return NextResponse.json(data as Court[], {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("[CaseMap] GET /api/courts failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch courts" },
      { status: 500 }
    );
  }
}
