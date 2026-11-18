import type { Metadata } from "next";
import Link from "next/link";
import { FreightCalculatorForm } from "@/components/calculators/freight-calculator-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WebApplicationJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "China Freight Calculator: FCL, LCL, Air & Rail Cost" },
  description:
    "Instant China freight estimate for FCL, LCL, RoRo, air or rail. Pick ports, add insurance and customs, and see cost, transit time and CO2.",
  alternates: { canonical: "/calculator" },
  openGraph: {
    title: "China Freight Calculator: FCL, LCL, Air & Rail Cost",
    description:
      "Instant China freight estimate for FCL, LCL, RoRo, air or rail. See cost, transit time and CO2.",
  },
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="container py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Freight Calculator", path: "/calculator" }]} />
      <WebApplicationJsonLd
        name="China Freight Calculator"
        description="Instant China freight estimate for FCL, LCL, RoRo, air or rail shipping."
        url={`${SITE_URL}/calculator`}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Freight Calculator</h1>
        <p className="mt-2 text-muted-foreground">
          Get an instant, indicative shipping cost estimate for your cargo from China.
        </p>
      </div>
      <FreightCalculatorForm initialDestination={params.destination} />

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">How this calculator works</h2>
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>
            This calculator estimates China-origin freight by combining your shipment&apos;s physical details with
            per-unit rates and optional surcharges. Pick an origin port in China, a destination country and port, then
            choose FCL, LCL, RoRo, air or rail. Enter weight and volume — weight drives air and RoRo pricing, while
            volume drives LCL and FCL.
          </p>
          <p>
            FCL is quoted per container (20GP, 40GP or 40HQ), LCL per cubic meter, and air or rail by chargeable
            weight. Toggle insurance, customs clearance, destination delivery and dangerous-goods handling to see how
            each surcharge changes the total. The result shows an estimated total, a transit-time range and a CO2
            estimate, and is tagged &quot;Live Rate&quot; when a matching rate exists in our database or
            &quot;Estimated&quot; when it uses the static model.
          </p>
          <p>
            Treat the number as indicative, not a binding quote — real rates vary by carrier, season and fuel
            surcharge. Not sure whether FCL or LCL fits your volume? Read our{" "}
            <Link href="/blog/fcl-vs-lcl-which-to-choose" className="text-primary underline underline-offset-2 hover:no-underline">
              FCL vs LCL guide
            </Link>{" "}
            and{" "}
            <Link
              href="/blog/Sea-Freight-vs-Air-Freight-Choosing-the-Right-Transport-for-Your-Cargo-in-2026"
              className="text-primary underline underline-offset-2 hover:no-underline"
            >
              compare sea and air freight
            </Link>{" "}
            before you book.
          </p>
        </div>
      </section>
    </div>
  );
}

