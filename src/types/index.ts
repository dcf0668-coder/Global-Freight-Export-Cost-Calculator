// ---------------------------------------------------------------------------
// Domain types shared between the UI, API routes, and calculation engines.
// Mirrors the Prisma schema in prisma/schema.prisma but kept decoupled so the
// frontend can be developed/tested without a live database connection.
// ---------------------------------------------------------------------------

export type CargoType = "FCL" | "LCL" | "RORO" | "VEHICLE" | "AIR" | "RAIL";

export type ContainerSize = "20GP" | "40GP" | "40HQ" | "45HQ";

export type VehicleType = "SUV" | "SEDAN" | "PICKUP" | "TRUCK" | "BUS" | "EV" | "HYBRID";

export interface Country {
  id: string;
  name: string;
  isoCode: string; // ISO 3166-1 alpha-2
  region: string;
  currency: string;
  voltage: string;
  drivingSide: "LEFT" | "RIGHT";
  importDutyRate: number; // percentage, e.g. 10 = 10%
  vatRate: number; // percentage
  requiresInspection: boolean;
  requiredDocuments: string[];
  popularPorts: string[]; // port ids
}

export interface Port {
  id: string;
  name: string;
  unlocode: string;
  countryId: string;
  countryName: string;
  latitude: number;
  longitude: number;
  nearbyAirports: string[];
  nearbyWarehouses: string[];
  roroAvailable: boolean;
  containerAvailable: boolean;
}

export interface ShippingLine {
  id: string;
  name: string;
  slug: string;
  website: string;
  trackingUrl: string;
  coverageRegions: string[];
  offersContainer: boolean;
  offersRoro: boolean;
  description: string;
}

export interface FreightRate {
  originPortId: string;
  destinationPortId: string;
  cargoType: CargoType;
  containerSize?: ContainerSize;
  baseRatePerUnit: number; // per CBM (LCL), per container (FCL), per vehicle (RoRo)
  transitDays: number;
  shippingLineId: string;
}

export interface CalculatorInput {
  originCountryId: string;
  originPortId: string;
  destinationCountryId: string;
  destinationPortId: string;
  cargoType: CargoType;
  containerSize?: ContainerSize;
  weightKg: number;
  volumeCbm: number;
  dangerousGoods: boolean;
  insurance: boolean;
  customsClearance: boolean;
  destinationDelivery: boolean;
  declaredValue?: number;
}

export interface CalculatorResult {
  estimatedFreightCost: number;
  surcharges: {
    dangerousGoods: number;
    insurance: number;
    customsClearance: number;
    destinationDelivery: number;
  };
  totalEstimate: number;
  currency: string;
  transitTimeDays: { min: number; max: number };
  recommendedMethod: CargoType;
  co2EstimateKg: number;
  breakdown: { label: string; amount: number }[];
}

export interface RoroCalculatorInput {
  vehicleType: VehicleType;
  lengthM: number;
  widthM: number;
  heightM: number;
  weightKg: number;
  originPortId: string;
  destinationPortId: string;
  insurance: boolean;
}

export interface RoroCalculatorResult {
  oceanFreight: number;
  portCharges: number;
  documentationFee: number;
  inspectionFee: number;
  insurance: number;
  totalEstimate: number;
  currency: string;
  transitTimeDays: { min: number; max: number };
}

export interface ContainerCalculatorInput {
  cartonLengthCm: number;
  cartonWidthCm: number;
  cartonHeightCm: number;
  cartonWeightKg: number;
  numberOfCartons: number;
  usePallets: boolean;
}

export interface ContainerSuggestion {
  size: ContainerSize;
  utilizationPercent: number;
  cartonsPerContainer: number;
  containersNeeded: number;
}

export interface ContainerCalculatorResult {
  totalCbm: number;
  totalWeightKg: number;
  loadingEfficiencyPercent: number;
  suggestions: ContainerSuggestion[];
}

export interface ExportCostInput {
  vehiclePriceExw: number;
  fobUplift: number; // amount added to EXW to reach FOB (inland transport, export handling)
  oceanFreight: number;
  insuranceRate: number; // percentage of CIF
  inspectionFee: number;
  exportDeclarationFee: number;
  originPortCharges: number;
  destinationCustomsFee: number;
  importDutyRate: number; // percentage
  vatRate: number; // percentage
  localDeliveryFee: number;
  desiredProfitMarginPercent: number;
}

export interface ExportCostResult {
  fob: number;
  cif: number;
  importDuty: number;
  vat: number;
  totalLandedCost: number;
  suggestedSellingPrice: number;
  breakdown: { label: string; amount: number }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  category: "IMPORT" | "EXPORT" | "SHIPPING" | "FREIGHT" | "AUTOMOBILE_EXPORT" | "TRADE_GUIDE";
  coverImage?: string;
  publishedAt: string; // ISO date
  author: string;
  readingTimeMinutes: number;
}
