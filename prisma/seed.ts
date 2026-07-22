import { PrismaClient } from "@prisma/client";
import { countries } from "../src/lib/data/countries";
import { ports } from "../src/lib/data/ports";
import { shippingLines } from "../src/lib/data/shippingLines";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding countries...");
  for (const c of countries) {
    await prisma.country.upsert({
      where: { isoCode: c.isoCode },
      update: {},
      create: {
        name: c.name,
        isoCode: c.isoCode,
        region: c.region,
        currency: c.currency,
        voltage: c.voltage,
        drivingSide: c.drivingSide,
        importDutyRate: c.importDutyRate,
        vatRate: c.vatRate,
        requiresInspection: c.requiresInspection,
        requiredDocuments: c.requiredDocuments,
      },
    });
  }

  // China isn't in the sample "destination" country list (it's always origin),
  // so ensure it exists for the Port -> Country relation.
  await prisma.country.upsert({
    where: { isoCode: "CN" },
    update: {},
    create: {
      name: "China",
      isoCode: "CN",
      region: "East Asia",
      currency: "CNY",
      voltage: "220V",
      drivingSide: "RIGHT",
      importDutyRate: 0,
      vatRate: 13,
      requiresInspection: false,
      requiredDocuments: ["Bill of Lading", "Commercial Invoice", "Packing List", "Export License"],
    },
  });

  console.log("Seeding ports...");
  for (const p of ports) {
    const country = await prisma.country.findFirst({ where: { name: p.countryName } });
    if (!country) continue;
    await prisma.port.upsert({
      where: { unlocode: p.unlocode },
      update: {},
      create: {
        name: p.name,
        unlocode: p.unlocode,
        countryId: country.id,
        latitude: p.latitude,
        longitude: p.longitude,
        nearbyAirports: p.nearbyAirports,
        nearbyWarehouses: p.nearbyWarehouses,
        roroAvailable: p.roroAvailable,
        containerAvailable: p.containerAvailable,
      },
    });
  }

  console.log("Seeding shipping lines...");
  for (const s of shippingLines) {
    await prisma.shippingLine.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
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
