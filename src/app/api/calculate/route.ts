import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateFreight } from "@/lib/calculations/freight";
import { calculateRoro } from "@/lib/calculations/roro";
import { calculateContainerLoad } from "@/lib/calculations/container";
import { calculateExportCost } from "@/lib/calculations/exportCost";
import { findFreightRate, findPortCharges, findExchangeRate } from "@/lib/db/rates";
import { round } from "@/lib/utils";

const freightSchema = z.object({
  originCountryId: z.string(),
  originPortId: z.string(),
  destinationCountryId: z.string(),
  destinationPortId: z.string(),
  cargoType: z.enum(["FCL", "LCL", "RORO", "VEHICLE", "AIR", "RAIL"]),
  containerSize: z.enum(["20GP", "40GP", "40HQ", "45HQ"]).optional(),
  weightKg: z.number().nonnegative(),
  volumeCbm: z.number().nonnegative(),
  dangerousGoods: z.boolean(),
  insurance: z.boolean(),
  customsClearance: z.boolean(),
  destinationDelivery: z.boolean(),
  declaredValue: z.number().optional(),
});

const roroSchema = z.object({
  mode: z.literal("roro"),
  vehicleType: z.enum(["SUV", "SEDAN", "PICKUP", "TRUCK", "BUS", "EV", "HYBRID"]),
  lengthM: z.number().positive(),
  widthM: z.number().positive(),
  heightM: z.number().positive(),
  weightKg: z.number().positive(),
  originPortId: z.string(),
  destinationPortId: z.string(),
  insurance: z.boolean(),
});

const containerSchema = z.object({
  mode: z.literal("container"),
  cartonLengthCm: z.number().positive(),
  cartonWidthCm: z.number().positive(),
  cartonHeightCm: z.number().positive(),
  cartonWeightKg: z.number().positive(),
  numberOfCartons: z.number().int().positive(),
  usePallets: z.boolean(),
});

const exportCostSchema = z.object({
  mode: z.literal("export-cost"),
  vehiclePriceExw: z.number().nonnegative(),
  fobUplift: z.number().nonnegative(),
  oceanFreight: z.number().nonnegative(),
  insuranceRate: z.number().nonnegative(),
  inspectionFee: z.number().nonnegative(),
  exportDeclarationFee: z.number().nonnegative(),
  originPortCharges: z.number().nonnegative(),
  destinationCustomsFee: z.number().nonnegative(),
  importDutyRate: z.number().nonnegative(),
  vatRate: z.number().nonnegative(),
  localDeliveryFee: z.number().nonnegative(),
  desiredProfitMarginPercent: z.number(),
});

/**
 * POST /api/calculate
 * Dispatches to the appropriate calculation engine based on the `mode` field.
 * Requests with no `mode` are treated as the main freight calculator for
 * backwards-compatible / simpler client calls.
 *
 * For the freight and RoRo modes, this first tries to find a real rate in
 * the database for the requested lane (see src/lib/db/rates.ts). If found,
 * the result is computed from that live rate and flagged `rateSource: "live"`.
 * If no DATABASE_URL is configured, the DB is unreachable, or no rate has
 * been entered for that specific lane yet, it falls back to the static
 * estimator and flags `rateSource: "estimated"` — the API never errors out
 * just because the database isn't set up.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    if (body.mode === "roro") {
      const parsed = roroSchema.parse(body);
      const [rateOverride, portChargeOverride] = await Promise.all([
        findFreightRate(parsed.originPortId, parsed.destinationPortId, "RORO"),
        findPortCharges(parsed.destinationPortId),
      ]);
      const result = calculateRoro(parsed, rateOverride, portChargeOverride);
      return NextResponse.json(result);
    }
    if (body.mode === "container") {
      const parsed = containerSchema.parse(body);
      return NextResponse.json(calculateContainerLoad(parsed));
    }
    if (body.mode === "export-cost") {
      const parsed = exportCostSchema.parse(body);
      return NextResponse.json(calculateExportCost(parsed));
    }

    const parsed = freightSchema.parse(body);
    const rateOverride = await findFreightRate(
      parsed.originPortId,
      parsed.destinationPortId,
      parsed.cargoType,
      parsed.containerSize
    );
    const result = calculateFreight(parsed, rateOverride);

    // If a real port-charge record exists for the destination and the user
    // requested customs clearance, use the actual fee instead of the flat
    // $150 placeholder, and adjust the total/breakdown to match.
    if (parsed.customsClearance) {
      const portCharges = await findPortCharges(parsed.destinationPortId);
      if (portCharges) {
        const delta = portCharges.customsClearanceFee - result.surcharges.customsClearance;
        result.surcharges.customsClearance = portCharges.customsClearanceFee;
        result.totalEstimate = round(result.totalEstimate + delta);
        const line = result.breakdown.find((b) => b.label === "Customs Clearance");
        if (line) line.amount = portCharges.customsClearanceFee;
      }
    }

    // Attach a currency-converted estimate when a live ExchangeRate exists
    // for the destination country.
    const fx = await findExchangeRate(parsed.destinationCountryId);
    if (fx) {
      result.convertedEstimate = { amount: round(result.totalEstimate * fx.rateToUsd), currency: fx.currency };
    }

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
