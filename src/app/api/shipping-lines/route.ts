import { NextRequest, NextResponse } from "next/server";
import { shippingLines } from "@/lib/data/shippingLines";

/**
 * GET /api/shipping-lines
 * GET /api/shipping-lines?slug=maersk
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const line = shippingLines.find((s) => s.slug === slug);
    if (!line) return NextResponse.json({ error: "Shipping line not found" }, { status: 404 });
    return NextResponse.json(line);
  }

  return NextResponse.json(shippingLines);
}
