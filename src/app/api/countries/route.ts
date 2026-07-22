import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/lib/data/countries";

/**
 * GET /api/countries
 * GET /api/countries?id=us
 * GET /api/countries?region=Europe
 *
 * In production this reads from the `Country` table via Prisma. The static
 * dataset is used here as a drop-in fallback so the API works without a
 * configured DATABASE_URL.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const region = searchParams.get("region");

  if (id) {
    const country = countries.find((c) => c.id === id);
    if (!country) return NextResponse.json({ error: "Country not found" }, { status: 404 });
    return NextResponse.json(country);
  }

  const filtered = region ? countries.filter((c) => c.region.toLowerCase() === region.toLowerCase()) : countries;
  return NextResponse.json(filtered);
}
