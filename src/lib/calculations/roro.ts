import { RoroCalculatorInput, RoroCalculatorResult, VehicleType } from "@/types";
import { round } from "@/lib/utils";

// Base ocean freight per CBM-equivalent for RoRo, scaled by vehicle category.
// RoRo pricing in practice is usually a flat "per unit" freight banded by vehicle
// size class rather than pure CBM, so we model it as a base rate x multiplier.
// This is the FALLBACK used when no matching FreightRate/PortCharge row exists
// in the database for this lane — see src/lib/db/rates.ts and /api/calculate.
const VEHICLE_BASE_RATE: Record<VehicleType, number> = {
  SEDAN: 750,
  SUV: 950,
  EV: 1050, // EVs often carry a battery/DG handling premium
  HYBRID: 900,
  PICKUP: 1100,
  TRUCK: 1600,
  BUS: 2400,
};

const PORT_CHARGE_FLAT = 220;
const DOCUMENTATION_FEE_FLAT = 85;
const INSPECTION_FEE_FLAT = 60;

export interface RoroRateOverride {
  baseRatePerUnit: number;
  transitDays: number;
}

export interface RoroPortChargeOverride {
  documentationFee: number;
  inspectionFee: number;
  terminalHandlingFee: number;
}

export function calculateRoro(
  input: RoroCalculatorInput,
  rateOverride?: RoroRateOverride | null,
  portChargeOverride?: RoroPortChargeOverride | null
): RoroCalculatorResult {
  const dimensionalFactor = (input.lengthM * input.widthM * input.heightM) / 10; // normalizes larger vehicles
  const weightFactor = input.weightKg / 1500; // reference sedan weight ~1500kg

  const baseRate = rateOverride ? rateOverride.baseRatePerUnit : VEHICLE_BASE_RATE[input.vehicleType];
  // A live per-lane rate is already a full quote for the vehicle class, so it
  // isn't re-scaled by dimensions the way the generic fallback rate is.
  const oceanFreight = rateOverride ? round(baseRate) : round(baseRate * Math.max(dimensionalFactor, weightFactor, 1));

  const portCharges = portChargeOverride ? round(portChargeOverride.terminalHandlingFee) : PORT_CHARGE_FLAT;
  const documentationFee = portChargeOverride ? round(portChargeOverride.documentationFee) : DOCUMENTATION_FEE_FLAT;
  const inspectionFee = portChargeOverride ? round(portChargeOverride.inspectionFee) : INSPECTION_FEE_FLAT;

  const declaredValueEstimate = oceanFreight * 12; // rough vehicle value proxy for insurance calc
  const insurance = input.insurance ? round(declaredValueEstimate * 0.0035) : 0;

  const totalEstimate = round(oceanFreight + portCharges + documentationFee + inspectionFee + insurance);

  return {
    oceanFreight,
    portCharges,
    documentationFee,
    inspectionFee,
    insurance,
    totalEstimate,
    currency: "USD",
    transitTimeDays: rateOverride ? { min: rateOverride.transitDays, max: rateOverride.transitDays } : { min: 20, max: 42 },
    rateSource: rateOverride ? "live" : "estimated",
  };
}
