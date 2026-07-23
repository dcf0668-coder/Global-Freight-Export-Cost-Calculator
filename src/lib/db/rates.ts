import { prisma } from "@/lib/prisma";
import { CargoType, ContainerSize } from "@/types";

// Our TS-level ContainerSize strings differ from the Prisma schema's enum
// naming (which can't start with a digit) — map between them here.
const CONTAINER_SIZE_TO_DB: Record<ContainerSize, string> = {
  "20GP": "TWENTY_GP",
  "40GP": "FORTY_GP",
  "40HQ": "FORTY_HQ",
  "45HQ": "FORTY_FIVE_HQ",
};

export interface DbRateOverride {
  baseRatePerUnit: number;
  transitDays: number;
}

export interface DbPortCharges {
  documentationFee: number;
  inspectionFee: number;
  terminalHandlingFee: number;
  customsClearanceFee: number;
}

export interface DbExchangeRate {
  currency: string;
  rateToUsd: number;
}

/**
 * All lookups in this module are "safe": they return null instead of
 * throwing whenever DATABASE_URL isn't configured, the DB is unreachable, or
 * no matching row exists. Callers always have a static fallback (see
 * src/lib/calculations/*) so the app keeps working with zero DB setup —
 * connecting a real Postgres/Supabase instance just makes results more
 * accurate as real rates get entered.
 */
function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Look up a live FreightRate row for the given lane, cargo type, and (for FCL) container size. */
export async function findFreightRate(
  originPortId: string,
  destinationPortId: string,
  cargoType: CargoType,
  containerSize?: ContainerSize
): Promise<DbRateOverride | null> {
  if (!hasDatabase()) return null;
  try {
    const rate = await prisma.freightRate.findFirst({
      where: {
        originPortId,
        destinationPortId,
        cargoType: cargoType as never,
        containerSize: containerSize ? (CONTAINER_SIZE_TO_DB[containerSize] as never) : undefined,
        OR: [{ effectiveTo: null }, { effectiveTo: { gt: new Date() } }],
      },
      orderBy: { effectiveFrom: "desc" },
    });
    if (!rate) return null;
    return { baseRatePerUnit: rate.baseRatePerUnit, transitDays: rate.transitDays };
  } catch {
    return null;
  }
}

/** Look up real port charge line items for a port, if entered in the DB. */
export async function findPortCharges(portId: string): Promise<DbPortCharges | null> {
  if (!hasDatabase()) return null;
  try {
    const charge = await prisma.portCharge.findFirst({ where: { portId } });
    if (!charge) return null;
    return {
      documentationFee: charge.documentationFee,
      inspectionFee: charge.inspectionFee,
      terminalHandlingFee: charge.terminalHandlingFee,
      customsClearanceFee: charge.customsClearanceFee,
    };
  } catch {
    return null;
  }
}

/** Look up a currency conversion rate for a destination country, if entered in the DB. */
export async function findExchangeRate(countryId: string): Promise<DbExchangeRate | null> {
  if (!hasDatabase()) return null;
  try {
    const rate = await prisma.exchangeRate.findUnique({ where: { countryId } });
    if (!rate) return null;
    return { currency: rate.currency, rateToUsd: rate.rateToUsd };
  } catch {
    return null;
  }
}

/** Look up a specific vehicle make/model catalog entry for exact RoRo dimensions. */
export async function findVehicleModel(make: string, model: string, variant?: string) {
  if (!hasDatabase()) return null;
  try {
    return await prisma.vehicleModel.findFirst({ where: { make, model, variant: variant ?? null } });
  } catch {
    return null;
  }
}
