import { ExportCostInput, ExportCostResult } from "@/types";
import { round } from "@/lib/utils";

/**
 * Computes FOB -> CIF -> Landed Cost -> Suggested Selling Price using standard
 * Incoterms-based logic:
 *   FOB = EXW + inland transport/export handling uplift
 *   CIF = FOB + Ocean Freight + Insurance
 *   Landed Cost = CIF + Import Duty + VAT + destination customs/handling + local delivery
 */
export function calculateExportCost(input: ExportCostInput): ExportCostResult {
  const fob = round(input.vehiclePriceExw + input.fobUplift);

  const preInsuranceCif = fob + input.oceanFreight;
  const insurance = round(preInsuranceCif * (input.insuranceRate / 100));
  const cif = round(preInsuranceCif + insurance);

  const importDuty = round(cif * (input.importDutyRate / 100));
  const vatBase = cif + importDuty; // VAT is typically charged on CIF + duty
  const vat = round(vatBase * (input.vatRate / 100));

  const totalLandedCost = round(
    cif +
      importDuty +
      vat +
      input.inspectionFee +
      input.exportDeclarationFee +
      input.originPortCharges +
      input.destinationCustomsFee +
      input.localDeliveryFee
  );

  const suggestedSellingPrice = round(totalLandedCost * (1 + input.desiredProfitMarginPercent / 100));

  return {
    fob,
    cif,
    importDuty,
    vat,
    totalLandedCost,
    suggestedSellingPrice,
    breakdown: [
      { label: "EXW Price", amount: round(input.vehiclePriceExw) },
      { label: "Export Handling / Inland (to FOB)", amount: round(input.fobUplift) },
      { label: "FOB", amount: fob },
      { label: "Ocean Freight", amount: round(input.oceanFreight) },
      { label: "Marine Insurance", amount: insurance },
      { label: "CIF", amount: cif },
      { label: "Import Duty", amount: importDuty },
      { label: "VAT", amount: vat },
      { label: "Inspection Fee", amount: round(input.inspectionFee) },
      { label: "Export Declaration Fee", amount: round(input.exportDeclarationFee) },
      { label: "Origin Port Charges", amount: round(input.originPortCharges) },
      { label: "Destination Customs Fee", amount: round(input.destinationCustomsFee) },
      { label: "Local Delivery", amount: round(input.localDeliveryFee) },
      { label: "Total Landed Cost", amount: totalLandedCost },
      { label: "Suggested Selling Price", amount: suggestedSellingPrice },
    ],
  };
}
