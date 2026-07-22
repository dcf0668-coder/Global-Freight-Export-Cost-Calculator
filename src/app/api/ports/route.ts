import { NextRequest, NextResponse } from "next/server";
import { ports } from "@/lib/data/ports";

/**
 * GET /api/ports
 * GET /api/ports?country=cn
 * GET /api/ports?unlocode=CNSHA
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country");
  const unlocode = searchParams.get("unlocode");

  if (unlocode) {
    const port = ports.find((p) => p.unlocode.toLowerCase() === unlocode.toLowerCase());
    if (!port) return NextResponse.json({ error: "Port not found" }, { status: 404 });
    return NextResponse.json(port);
  }

  const filtered = country ? ports.filter((p) => p.countryId === country) : ports;
  return NextResponse.json(filtered);
}
