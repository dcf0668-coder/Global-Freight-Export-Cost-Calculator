import { PrismaClient } from "@prisma/client";
import { countries } from "../src/lib/data/countries";
import { ports } from "../src/lib/data/ports";
import { shippingLines } from "../src/lib/data/shippingLines";

const prisma = new PrismaClient();

// IMPORTANT: Country/Port/ShippingLine rows are seeded with the SAME ids used
// by the static frontend datasets (src/lib/data/*.ts) — e.g. Country "cn",
// Port "cn-sha", ShippingLine "maersk" — rather than letting Prisma generate
// random cuids. This is what lets the frontend's dropdown selections (which
// come from those static files) match real DB rows once a database is
// connected: /api/calculate looks up FreightRate/PortCharge/ExchangeRate by
// exactly the ids the browser sends. If you seed with random ids instead,
// the "live" rate path will never match anything the UI can request.

async function main() {
  console.log("Seeding countries...");
  for (const c of countries) {
    await prisma.country.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        isoCode: c.isoCode,
        region: c.region,
        subregion: c.subregion,
        currency: c.currency,
        voltage: c.voltage,
        drivingSide: c.drivingSide,
        importDutyRate: c.importDutyRate,
        vatRate: c.vatRate,
        tariffVerified: c.tariffVerified,
        requiresInspection: c.requiresInspection,
        requiredDocuments: c.requiredDocuments,
      },
    });
  }

  console.log("Seeding ports...");
  for (const p of ports) {
    await prisma.port.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        unlocode: p.unlocode,
        countryId: p.countryId,
        latitude: p.latitude,
        longitude: p.longitude,
        nearbyAirports: p.nearbyAirports,
        nearbyWarehouses: p.nearbyWarehouses,
        roroAvailable: p.roroAvailable,
        containerAvailable: p.containerAvailable,
        dataVerified: p.dataVerified,
      },
    });
  }

  console.log("Seeding shipping lines...");
  for (const s of shippingLines) {
    await prisma.shippingLine.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        name: s.name,
        slug: s.slug,
        website: s.website,
        trackingUrl: s.trackingUrl,
        coverageRegions: s.coverageRegions,
        offersContainer: s.offersContainer,
        offersRoro: s.offersRoro,
        description: s.description,
      },
    });
  }

  console.log("Seeding container type profiles...");
  const containerProfiles = [
    { size: "TWENTY_GP" as const, maxCbm: 33.2, maxPayloadKg: 25000, internalLenM: 5.9, internalWidM: 2.35, internalHgtM: 2.39 },
    { size: "FORTY_GP" as const, maxCbm: 67.7, maxPayloadKg: 27000, internalLenM: 12.03, internalWidM: 2.35, internalHgtM: 2.39 },
    { size: "FORTY_HQ" as const, maxCbm: 76.4, maxPayloadKg: 28500, internalLenM: 12.03, internalWidM: 2.35, internalHgtM: 2.69 },
    { size: "FORTY_FIVE_HQ" as const, maxCbm: 86.1, maxPayloadKg: 29000, internalLenM: 13.56, internalWidM: 2.35, internalHgtM: 2.69 },
  ];
  for (const cp of containerProfiles) {
    await prisma.containerTypeProfile.upsert({ where: { size: cp.size }, update: {}, create: cp });
  }

  console.log("Seeding vehicle type profiles...");
  const vehicleProfiles = [
    { type: "SEDAN" as const, avgLengthM: 4.7, avgWidthM: 1.8, avgHeightM: 1.45, avgWeightKg: 1500, baseRoroRate: 750 },
    { type: "SUV" as const, avgLengthM: 4.8, avgWidthM: 1.9, avgHeightM: 1.7, avgWeightKg: 1900, baseRoroRate: 950 },
    { type: "PICKUP" as const, avgLengthM: 5.4, avgWidthM: 1.9, avgHeightM: 1.8, avgWeightKg: 2100, baseRoroRate: 1100 },
    { type: "TRUCK" as const, avgLengthM: 7.5, avgWidthM: 2.4, avgHeightM: 2.8, avgWeightKg: 6000, baseRoroRate: 1600 },
    { type: "BUS" as const, avgLengthM: 11, avgWidthM: 2.5, avgHeightM: 3.2, avgWeightKg: 12000, baseRoroRate: 2400 },
    { type: "EV" as const, avgLengthM: 4.7, avgWidthM: 1.85, avgHeightM: 1.55, avgWeightKg: 1900, baseRoroRate: 1050 },
    { type: "HYBRID" as const, avgLengthM: 4.7, avgWidthM: 1.8, avgHeightM: 1.5, avgWeightKg: 1600, baseRoroRate: 900 },
  ];
  for (const vp of vehicleProfiles) {
    await prisma.vehicleTypeProfile.upsert({ where: { type: vp.type }, update: {}, create: vp });
  }

  // ---------------------------------------------------------------------
  // Phase C: seed data that exercises the live-rate DB path in /api/calculate.
  // This is a representative sample (not a full rate card) so that
  // connecting a real database produces at least some "rateSource: live"
  // results out of the box, on the busiest China-origin lanes.
  // ---------------------------------------------------------------------

  console.log("Seeding vehicle model catalog...");
  const vehicleModels: { make: string; model: string; vehicleType: "SEDAN"|"SUV"|"PICKUP"|"TRUCK"|"BUS"|"EV"|"HYBRID"; lengthM: number; widthM: number; heightM: number; weightKg: number; isEV?: boolean }[] = [
    { make: "Toyota", model: "Corolla", vehicleType: "SEDAN", lengthM: 4.63, widthM: 1.78, heightM: 1.44, weightKg: 1320 },
    { make: "Toyota", model: "Camry", vehicleType: "SEDAN", lengthM: 4.88, widthM: 1.84, heightM: 1.45, weightKg: 1500 },
    { make: "Toyota", model: "RAV4", vehicleType: "SUV", lengthM: 4.6, widthM: 1.85, heightM: 1.69, weightKg: 1650 },
    { make: "Toyota", model: "Hilux", vehicleType: "PICKUP", lengthM: 5.33, widthM: 1.86, heightM: 1.82, weightKg: 2100 },
    { make: "Toyota", model: "Coaster", vehicleType: "BUS", lengthM: 6.99, widthM: 2.08, heightM: 2.61, weightKg: 4200 },
    { make: "Honda", model: "CR-V", vehicleType: "SUV", lengthM: 4.68, widthM: 1.86, heightM: 1.68, weightKg: 1580 },
    { make: "Honda", model: "Civic", vehicleType: "SEDAN", lengthM: 4.68, widthM: 1.8, heightM: 1.42, weightKg: 1310 },
    { make: "Ford", model: "Ranger", vehicleType: "PICKUP", lengthM: 5.36, widthM: 1.86, heightM: 1.85, weightKg: 2200 },
    { make: "Ford", model: "F-150", vehicleType: "TRUCK", lengthM: 5.89, widthM: 2.03, heightM: 1.98, weightKg: 2300 },
    { make: "BYD", model: "Atto 3", vehicleType: "EV", lengthM: 4.46, widthM: 1.88, heightM: 1.62, weightKg: 1750, isEV: true },
    { make: "BYD", model: "Seal", vehicleType: "EV", lengthM: 4.8, widthM: 1.88, heightM: 1.46, weightKg: 1900, isEV: true },
    { make: "Tesla", model: "Model Y", vehicleType: "EV", lengthM: 4.75, widthM: 1.92, heightM: 1.62, weightKg: 1980, isEV: true },
    { make: "Tesla", model: "Model 3", vehicleType: "EV", lengthM: 4.69, widthM: 1.85, heightM: 1.44, weightKg: 1760, isEV: true },
    { make: "Toyota", model: "Prius", vehicleType: "HYBRID", lengthM: 4.6, widthM: 1.78, heightM: 1.47, weightKg: 1400 },
    { make: "Isuzu", model: "NPR", vehicleType: "TRUCK", lengthM: 6.2, widthM: 2.0, heightM: 2.3, weightKg: 3500 },
    { make: "Hyundai", model: "Tucson", vehicleType: "SUV", lengthM: 4.5, widthM: 1.86, heightM: 1.65, weightKg: 1600 },
    { make: "Volkswagen", model: "Golf", vehicleType: "SEDAN", lengthM: 4.28, widthM: 1.79, heightM: 1.45, weightKg: 1300 },
    { make: "Nissan", model: "Navara", vehicleType: "PICKUP", lengthM: 5.33, widthM: 1.85, heightM: 1.85, weightKg: 2050 },
    { make: "Mercedes-Benz", model: "Sprinter", vehicleType: "BUS", lengthM: 6.97, widthM: 2.0, heightM: 2.6, weightKg: 2700 },
    { make: "BYD", model: "Han", vehicleType: "EV", lengthM: 4.98, widthM: 1.91, heightM: 1.5, weightKg: 2020, isEV: true },
  ];
  for (const vm of vehicleModels) {
    const existing = await prisma.vehicleModel.findFirst({ where: { make: vm.make, model: vm.model, variant: null } });
    if (existing) continue;
    await prisma.vehicleModel.create({ data: { ...vm, isEV: vm.isEV ?? false } });
  }

  console.log("Seeding port charges...");
  const portChargeSeed: { portId: string; documentationFee: number; inspectionFee: number; terminalHandlingFee: number; customsClearanceFee: number }[] = [
    { portId: "nl-rtm", documentationFee: 95, inspectionFee: 70, terminalHandlingFee: 240, customsClearanceFee: 180 },
    { portId: "de-ham", documentationFee: 90, inspectionFee: 65, terminalHandlingFee: 230, customsClearanceFee: 175 },
    { portId: "us-lax", documentationFee: 110, inspectionFee: 85, terminalHandlingFee: 310, customsClearanceFee: 220 },
    { portId: "us-nyc", documentationFee: 115, inspectionFee: 90, terminalHandlingFee: 320, customsClearanceFee: 230 },
    { portId: "gb-fxt", documentationFee: 100, inspectionFee: 80, terminalHandlingFee: 260, customsClearanceFee: 200 },
    { portId: "ae-jea", documentationFee: 70, inspectionFee: 50, terminalHandlingFee: 190, customsClearanceFee: 130 },
    { portId: "za-dur", documentationFee: 85, inspectionFee: 75, terminalHandlingFee: 220, customsClearanceFee: 160 },
    { portId: "au-mel", documentationFee: 105, inspectionFee: 95, terminalHandlingFee: 280, customsClearanceFee: 210 },
    { portId: "br-ssz", documentationFee: 90, inspectionFee: 80, terminalHandlingFee: 235, customsClearanceFee: 190 },
    { portId: "sg-sin", documentationFee: 60, inspectionFee: 45, terminalHandlingFee: 175, customsClearanceFee: 110 },
    { portId: "ng-los", documentationFee: 130, inspectionFee: 120, terminalHandlingFee: 300, customsClearanceFee: 260 },
    { portId: "in-nsa", documentationFee: 80, inspectionFee: 70, terminalHandlingFee: 210, customsClearanceFee: 170 },
  ];
  for (const pc of portChargeSeed) {
    const port = await prisma.port.findUnique({ where: { id: pc.portId } });
    if (!port) continue;
    const existing = await prisma.portCharge.findFirst({ where: { portId: pc.portId } });
    if (existing) continue;
    await prisma.portCharge.create({ data: pc });
  }

  console.log("Seeding exchange rates...");
  // Illustrative point-in-time rates for demo purposes only — replace with a
  // live FX feed (e.g. exchangerate.host, a bank API) before production use.
  const exchangeRateSeed: { countryId: string; currency: string; rateToUsd: number }[] = [
    { countryId: "gb", currency: "GBP", rateToUsd: 0.79 },
    { countryId: "de", currency: "EUR", rateToUsd: 0.92 },
    { countryId: "fr", currency: "EUR", rateToUsd: 0.92 },
    { countryId: "nl", currency: "EUR", rateToUsd: 0.92 },
    { countryId: "au", currency: "AUD", rateToUsd: 1.52 },
    { countryId: "za", currency: "ZAR", rateToUsd: 18.4 },
    { countryId: "ng", currency: "NGN", rateToUsd: 1550 },
    { countryId: "in", currency: "INR", rateToUsd: 83.5 },
    { countryId: "br", currency: "BRL", rateToUsd: 5.4 },
    { countryId: "ae", currency: "AED", rateToUsd: 3.67 },
    { countryId: "sg", currency: "SGD", rateToUsd: 1.34 },
    { countryId: "jp", currency: "JPY", rateToUsd: 149 },
    { countryId: "kr", currency: "KRW", rateToUsd: 1330 },
    { countryId: "mx", currency: "MXN", rateToUsd: 18.1 },
    { countryId: "ca", currency: "CAD", rateToUsd: 1.36 },
  ];
  for (const fx of exchangeRateSeed) {
    const country = await prisma.country.findUnique({ where: { id: fx.countryId } });
    if (!country) continue;
    await prisma.exchangeRate.upsert({
      where: { countryId: fx.countryId },
      update: { rateToUsd: fx.rateToUsd, currency: fx.currency },
      create: fx,
    });
  }

  console.log("Seeding freight rates...");
  // A representative sample of real China-origin lanes — not a full rate
  // card. Any lane/cargo-type combination not listed here falls back to the
  // static estimator in src/lib/calculations/freight.ts, flagged
  // rateSource: "estimated".
  type RateSeed = {
    originPortId: string;
    destinationPortId: string;
    shippingLineId: string;
    cargoType: "FCL" | "LCL" | "RORO" | "VEHICLE" | "AIR" | "RAIL";
    containerSize?: "TWENTY_GP" | "FORTY_GP" | "FORTY_HQ" | "FORTY_FIVE_HQ";
    baseRatePerUnit: number;
    transitDays: number;
  };
  const freightRateSeed: RateSeed[] = [
    { originPortId: "cn-sha", destinationPortId: "nl-rtm", shippingLineId: "maersk", cargoType: "FCL", containerSize: "TWENTY_GP", baseRatePerUnit: 1650, transitDays: 32 },
    { originPortId: "cn-sha", destinationPortId: "nl-rtm", shippingLineId: "maersk", cargoType: "FCL", containerSize: "FORTY_HQ", baseRatePerUnit: 2450, transitDays: 32 },
    { originPortId: "cn-sha", destinationPortId: "nl-rtm", shippingLineId: "msc", cargoType: "LCL", baseRatePerUnit: 52, transitDays: 34 },
    { originPortId: "cn-sha", destinationPortId: "us-lax", shippingLineId: "cosco", cargoType: "FCL", containerSize: "TWENTY_GP", baseRatePerUnit: 1580, transitDays: 20 },
    { originPortId: "cn-sha", destinationPortId: "us-lax", shippingLineId: "cosco", cargoType: "FCL", containerSize: "FORTY_HQ", baseRatePerUnit: 2280, transitDays: 20 },
    { originPortId: "cn-sha", destinationPortId: "us-lax", shippingLineId: "one", cargoType: "AIR", baseRatePerUnit: 3.9, transitDays: 4 },
    { originPortId: "cn-ngb", destinationPortId: "de-ham", shippingLineId: "hapag-lloyd", cargoType: "FCL", containerSize: "FORTY_HQ", baseRatePerUnit: 2380, transitDays: 33 },
    { originPortId: "cn-ngb", destinationPortId: "de-ham", shippingLineId: "hapag-lloyd", cargoType: "LCL", baseRatePerUnit: 48, transitDays: 35 },
    { originPortId: "cn-szx", destinationPortId: "ae-jea", shippingLineId: "cma-cgm", cargoType: "FCL", containerSize: "TWENTY_GP", baseRatePerUnit: 1150, transitDays: 18 },
    { originPortId: "cn-szx", destinationPortId: "ae-jea", shippingLineId: "cma-cgm", cargoType: "FCL", containerSize: "FORTY_HQ", baseRatePerUnit: 1780, transitDays: 18 },
    { originPortId: "cn-gzh", destinationPortId: "ng-los", shippingLineId: "pil", cargoType: "FCL", containerSize: "TWENTY_GP", baseRatePerUnit: 2100, transitDays: 38 },
    { originPortId: "cn-gzh", destinationPortId: "ng-los", shippingLineId: "pil", cargoType: "RORO", baseRatePerUnit: 980, transitDays: 40 },
    { originPortId: "cn-sha", destinationPortId: "za-dur", shippingLineId: "msc", cargoType: "FCL", containerSize: "FORTY_HQ", baseRatePerUnit: 2650, transitDays: 30 },
    { originPortId: "cn-ngb", destinationPortId: "au-mel", shippingLineId: "one", cargoType: "FCL", containerSize: "TWENTY_GP", baseRatePerUnit: 1350, transitDays: 22 },
    { originPortId: "cn-ngb", destinationPortId: "au-mel", shippingLineId: "one", cargoType: "FCL", containerSize: "FORTY_HQ", baseRatePerUnit: 1980, transitDays: 22 },
    { originPortId: "cn-sha", destinationPortId: "br-ssz", shippingLineId: "evergreen", cargoType: "FCL", containerSize: "FORTY_HQ", baseRatePerUnit: 2980, transitDays: 40 },
    { originPortId: "cn-szx", destinationPortId: "sg-sin", shippingLineId: "one", cargoType: "FCL", containerSize: "TWENTY_GP", baseRatePerUnit: 480, transitDays: 6 },
    { originPortId: "cn-szx", destinationPortId: "sg-sin", shippingLineId: "one", cargoType: "LCL", baseRatePerUnit: 22, transitDays: 7 },
    { originPortId: "cn-sha", destinationPortId: "in-nsa", shippingLineId: "zim", cargoType: "FCL", containerSize: "TWENTY_GP", baseRatePerUnit: 890, transitDays: 16 },
  ];
  for (const rate of freightRateSeed) {
    const [origin, destination, line] = await Promise.all([
      prisma.port.findUnique({ where: { id: rate.originPortId } }),
      prisma.port.findUnique({ where: { id: rate.destinationPortId } }),
      prisma.shippingLine.findUnique({ where: { id: rate.shippingLineId } }),
    ]);
    if (!origin || !destination || !line) continue;
    const existing = await prisma.freightRate.findFirst({
      where: {
        originPortId: rate.originPortId,
        destinationPortId: rate.destinationPortId,
        cargoType: rate.cargoType,
        containerSize: rate.containerSize ?? null,
      },
    });
    if (existing) continue;
    await prisma.freightRate.create({
      data: {
        originPortId: rate.originPortId,
        destinationPortId: rate.destinationPortId,
        shippingLineId: rate.shippingLineId,
        cargoType: rate.cargoType,
        containerSize: rate.containerSize,
        baseRatePerUnit: rate.baseRatePerUnit,
        transitDays: rate.transitDays,
      },
    });
  }

  console.log("Seeding port capabilities...");
  const portCapabilitySeed: { portId: string; annualTeuCapacity?: number; maxVesselLoaM?: number; reeferPlugs?: number; bondedWarehouse?: boolean; railConnected?: boolean; customsBrokerOnSite?: boolean }[] = [
    { portId: "cn-sha", annualTeuCapacity: 47000000, maxVesselLoaM: 400, reeferPlugs: 12000, bondedWarehouse: true, railConnected: true, customsBrokerOnSite: true },
    { portId: "nl-rtm", annualTeuCapacity: 15300000, maxVesselLoaM: 400, reeferPlugs: 6000, bondedWarehouse: true, railConnected: true, customsBrokerOnSite: true },
    { portId: "sg-sin", annualTeuCapacity: 37000000, maxVesselLoaM: 400, reeferPlugs: 9000, bondedWarehouse: true, railConnected: false, customsBrokerOnSite: true },
    { portId: "us-lax", annualTeuCapacity: 9300000, maxVesselLoaM: 366, reeferPlugs: 2000, bondedWarehouse: true, railConnected: true, customsBrokerOnSite: true },
    { portId: "ae-jea", annualTeuCapacity: 15000000, maxVesselLoaM: 400, reeferPlugs: 5000, bondedWarehouse: true, railConnected: false, customsBrokerOnSite: true },
  ];
  for (const cap of portCapabilitySeed) {
    const port = await prisma.port.findUnique({ where: { id: cap.portId } });
    if (!port) continue;
    await prisma.portCapability.upsert({
      where: { portId: cap.portId },
      update: {},
      create: cap,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
