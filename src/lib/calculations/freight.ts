import { CalculatorInput, CalculatorResult, CargoType } from "@/types";
import { round } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Baseline rate tables. In production these are overridden by live FreightRate
// rows fetched from the database (see /api/calculate); these constants act as
// a fallback so the calculator still works without a populated DB.
// ---------------------------------------------------------------------------

const BASE_RATE_PER_CBM_LCL = 45; // USD per CBM, China -> avg. worldwide port
const BASE_RATE_PER_CONTAINER: Record<string, number> = {
  "20GP": 1400,
  "40GP": 2200,
  "40HQ": 2400,
  "45HQ": 2700,
};
const BASE_RATE_PER_VEHICLE_RORO = 900;
const BASE_RATE_PER_KG_AIR = 4.2;
const BASE_RATE_PER_KG_RAIL = 0.85;

const TRANSIT_DAYS: Record<CargoType, { min: number; max: number }> = {
  FCL: { min: 18, max: 35 },
  LCL: { min: 20, max: 38 },
  RORO: { min: 20, max: 40 },
  VEHICLE: { min: 20, max: 40 },
  AIR: { min: 3, max: 7 },
  RAIL: { min: 14, max: 24 },
};

// Rough CO2 emission factors, kg CO2 per tonne-km, by mode (industry averages).
const CO2_FACTOR_PER_TONNE_KM: Record<CargoType, number> = {
  FCL: 0.008,
  LCL: 0.012,
  RORO: 0.014,
  VEHICLE: 0.014,
  AIR: 0.5,
  RAIL: 0.03,
};
const AVG_SEA_DISTANCE_KM = 18000; // approximate China -> global average

/**
 * Estimate total freight cost and ancillary charges for a shipment.
 * This is a deterministic estimator meant to give exporters a fast, directional
 * quote — not a binding rate. Live integrations should replace the base rate
 * lookups with data from `FreightRate` records for the selected trade lane.
 */
export function calculateFreight(input: CalculatorInput): CalculatorResult {
  let baseCost = 0;

  switch (input.cargoType) {
    case "FCL": {
      const size = input.containerSize ?? "20GP";
      baseCost = BASE_RATE_PER_CONTAINER[size] ?? BASE_RATE_PER_CONTAINER["20GP"]!;
      break;
    }
    case "LCL": {
      // LCL is priced per CBM with a practical minimum charge (industry standard "W/M" logic).
      const chargeableCbm = Math.max(input.volumeCbm, 1);
      baseCost = chargeableCbm * BASE_RATE_PER_CBM_LCL;
      break;
    }
    case "RORO":
    case "VEHICLE": {
      baseCost = BASE_RATE_PER_VEHICLE_RORO;
      break;
    }
    case "AIR": {
      // Air freight uses the greater of actual weight and volumetric weight (1:167 kg/CBM standard).
      const volumetricWeight = input.volumeCbm * 167;
      const chargeableWeight = Math.max(input.weightKg, volumetricWeight);
      baseCost = chargeableWeight * BASE_RATE_PER_KG_AIR;
      break;
    }
    case "RAIL": {
      baseCost = Math.max(input.weightKg, 1) * BASE_RATE_PER_KG_RAIL;
      break;
    }
  }

  const dangerousGoodsSurcharge = input.dangerousGoods ? round(baseCost * 0.18) : 0;
  const declaredValue = input.declaredValue ?? baseCost * 10;
  const insuranceSurcharge = input.insurance ? round(declaredValue * 0.003) : 0; // ~0.3% of declared value
  const customsClearanceFee = input.customsClearance ? 150 : 0;
  const destinationDeliveryFee = input.destinationDelivery ? round(baseCost * 0.12) : 0;

  const totalEstimate = round(
    baseCost + dangerousGoodsSurcharge + insuranceSurcharge + customsClearanceFee + destinationDeliveryFee
  );

  const tonnage = Math.max(input.weightKg / 1000, 0.1);
  const co2EstimateKg = round(tonnage * AVG_SEA_DISTANCE_KM * CO2_FACTOR_PER_TONNE_KM[input.cargoType]);

  const recommendedMethod = recommendMethod(input);

  return {
    estimatedFreightCost: round(baseCost),
    surcharges: {
      dangerousGoods: dangerousGoodsSurcharge,
      insurance: insuranceSurcharge,
      customsClearance: customsClearanceFee,
      destinationDelivery: destinationDeliveryFee,
    },
    totalEstimate,
    currency: "USD",
    transitTimeDays: TRANSIT_DAYS[input.cargoType],
    recommendedMethod,
    co2EstimateKg,
    breakdown: [
      { label: "Base Freight", amount: round(baseCost) },
      ...(dangerousGoodsSurcharge ? [{ label: "Dangerous Goods Surcharge", amount: dangerousGoodsSurcharge }] : []),
      ...(insuranceSurcharge ? [{ label: "Cargo Insurance", amount: insuranceSurcharge }] : []),
      ...(customsClearanceFee ? [{ label: "Customs Clearance", amount: customsClearanceFee }] : []),
      ...(destinationDeliveryFee ? [{ label: "Destination Delivery", amount: destinationDeliveryFee }] : []),
    ],
  };
}

/** Suggest the most cost/time-efficient mode given volume and weight. */
function recommendMethod(input: CalculatorInput): CargoType {
  if (input.cargoType === "VEHICLE" || input.cargoType === "RORO") return input.cargoType;
  if (input.weightKg < 100 && input.volumeCbm < 1) return "AIR";
  if (input.volumeCbm >= 25) return "FCL";
  return "LCL";
}
