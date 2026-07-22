import { NextRequest, NextResponse } from "next/server";
import { countries } from "@/lib/data/countries";
import { ports } from "@/lib/data/ports";
import { shippingLines } from "@/lib/data/shippingLines";

/**
 * GET /api/search?q=shanghai
 * Unified search across countries, ports, and shipping lines — powers the
 * homepage search box and any future global search UI.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (!q) {
    return NextResponse.json({ countries: [], ports: [], shippingLines: [] });
  }

  const matchedCountries = countries
    .filter((c) => c.name.toLowerCase().includes(q) || c.isoCode.toLowerCase() === q)
    .slice(0, 8);

  const matchedPorts = ports
    .filter((p) => p.name.toLowerCase().includes(q) || p.unlocode.toLowerCase().includes(q))
    .slice(0, 8);

  const matchedLines = shippingLines
    .filter((s) => s.name.toLowerCase().includes(q))
    .slice(0, 8);

  return NextResponse.json({
    countries: matchedCountries,
    ports: matchedPorts,
    shippingLines: matchedLines,
  });
}
