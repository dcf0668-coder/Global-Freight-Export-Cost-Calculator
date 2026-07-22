import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateFreight } from "@/lib/calculations/freight";
import { calculateRoro } from "@/lib/calculations/roro";
import { calculateContainerLoad } from "@/lib/calculations/container";
import { calculateExportCost } from "@/lib/calculations/exportCost";

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
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    if (body.mode === "roro") {
      const parsed = roroSchema.parse(body);
      return NextResponse.json(calculateRoro(parsed));
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
    return NextResponse.json(calculateFreight(parsed));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
