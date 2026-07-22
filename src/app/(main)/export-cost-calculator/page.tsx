import type { Metadata } from "next";
import { ExportCostCalculatorForm } from "@/components/calculators/export-cost-calculator-form";

export const metadata: Metadata = {
  title: "Export Cost Calculator — Landed Cost & Selling Price",
  description: "Calculate total export landed cost from EXW/FOB through ocean freight, duties, VAT, and destination fees, plus a suggested selling price.",
  alternates: { canonical: "/export-cost-calculator" },
};

export default function ExportCostCalculatorPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Export Cost Calculator</h1>
        <p className="mt-2 text-muted-foreground">Calculate your total export cost and recommended selling price.</p>
      </div>
      <ExportCostCalculatorForm />
    </div>
  );
}
