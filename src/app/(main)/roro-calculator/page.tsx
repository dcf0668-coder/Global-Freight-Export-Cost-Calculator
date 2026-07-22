import type { Metadata } from "next";
import { RoroCalculatorForm } from "@/components/calculators/roro-calculator-form";

export const metadata: Metadata = {
  title: "RoRo Calculator — Vehicle Export Shipping Cost",
  description: "Estimate Roll-on/Roll-off vehicle export shipping costs from China, including ocean freight, port charges, and documentation fees.",
  alternates: { canonical: "/roro-calculator" },
};

export default function RoroCalculatorPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">RoRo Calculator</h1>
        <p className="mt-2 text-muted-foreground">Designed for automobile exporters shipping vehicles via Roll-on/Roll-off vessels.</p>
      </div>
      <RoroCalculatorForm />
    </div>
  );
}
