import type { Metadata } from "next";
import Link from "next/link";
import { ExportCostCalculatorForm } from "@/components/calculators/export-cost-calculator-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WebApplicationJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Landed Cost Calculator: EXW, FOB, CIF to Sell Price" },
  description:
    "Calculate full landed cost from EXW or FOB through ocean freight, duty, VAT and delivery, plus a suggested selling price for your import.",
  alternates: { canonical: "/export-cost-calculator" },
  openGraph: {
    title: "Landed Cost Calculator: EXW, FOB, CIF to Sell Price",
    description:
      "Calculate full landed cost from EXW or FOB through ocean freight, duty, VAT and delivery, plus a suggested selling price.",
  },
};

export default function ExportCostCalculatorPage() {
  return (
    <div className="container py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Export Cost Calculator", path: "/export-cost-calculator" }]} />
      <WebApplicationJsonLd
        name="Landed Cost Calculator"
        description="Calculate total export landed cost from EXW/FOB through freight, duty, VAT and delivery."
        url={`${SITE_URL}/export-cost-calculator`}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Export Cost Calculator</h1>
        <p className="mt-2 text-muted-foreground">Calculate your total export cost and recommended selling price.</p>
      </div>
      <ExportCostCalculatorForm />

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">How this calculator works</h2>
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>
            This calculator models a full landed-cost chain from the factory price to a suggested selling price. Start
            from the EXW vehicle price, add export handling and inland transport to reach FOB, then ocean freight and
            insurance to reach CIF. At destination, add import duty, VAT, customs and local delivery fees.
          </p>
          <p>
            The result breaks the total into FOB, CIF, duty, VAT and landed cost, then applies your desired margin to
            suggest a selling price. Duty and VAT rates default to destination-country values, but treat them as
            estimates — actual rates vary by commodity code and trade agreement.
          </p>
          <p>
            Incoterms define who pays for each leg and where risk transfers, which is why EXW, FOB and CIF produce very
            different totals. Read our{" "}
            <Link href="/blog/understanding-incoterms-2020" className="text-primary underline underline-offset-2 hover:no-underline">
              Incoterms 2020 guide
            </Link>{" "}
            to confirm you&apos;re using the right term before relying on the number.
          </p>
        </div>
      </section>
    </div>
  );
}

