import type { Metadata } from "next";
import { FreightCalculatorForm } from "@/components/calculators/freight-calculator-form";

export const metadata: Metadata = {
  title: "Freight Calculator — Estimate China Export Shipping Cost",
  description: "Calculate FCL, LCL, RoRo, air, and rail freight costs from China to any destination port. Instant transit time and CO2 estimates.",
  alternates: { canonical: "/calculator" },
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Freight Calculator</h1>
        <p className="mt-2 text-muted-foreground">
          Get an instant, indicative shipping cost estimate for your cargo from China.
        </p>
      </div>
      <FreightCalculatorForm initialDestination={params.destination} />
    </div>
  );
}
