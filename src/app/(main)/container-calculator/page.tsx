import type { Metadata } from "next";
import { ContainerCalculatorForm } from "@/components/calculators/container-calculator-form";

export const metadata: Metadata = {
  title: "Container Calculator — CBM & Container Loading Estimator",
  description: "Calculate total CBM, loading efficiency, and the best container size (20GP, 40GP, 40HQ) for your carton dimensions and quantity.",
  alternates: { canonical: "/container-calculator" },
};

export default function ContainerCalculatorPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Container Calculator</h1>
        <p className="mt-2 text-muted-foreground">Plan your carton loading and find the most efficient container size.</p>
      </div>
      <ContainerCalculatorForm />
    </div>
  );
}
