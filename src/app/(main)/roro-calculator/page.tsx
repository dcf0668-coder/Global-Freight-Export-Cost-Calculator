import type { Metadata } from "next";
import Link from "next/link";
import { RoroCalculatorForm } from "@/components/calculators/roro-calculator-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WebApplicationJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "RoRo Car Shipping Cost from China | Vehicle Calculator" },
  description:
    "Estimate RoRo vehicle shipping from China: ocean freight, port charges, documentation and insurance for sedans, SUVs, pickups, trucks, buses and EVs.",
  alternates: { canonical: "/roro-calculator" },
  openGraph: {
    title: "RoRo Car Shipping Cost from China | Vehicle Calculator",
    description:
      "Estimate RoRo vehicle shipping from China: ocean freight, port charges, documentation and insurance.",
  },
};

export default function RoroCalculatorPage() {
  return (
    <div className="container py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "RoRo Calculator", path: "/roro-calculator" }]} />
      <WebApplicationJsonLd
        name="RoRo Vehicle Shipping Calculator"
        description="Estimate RoRo vehicle shipping costs from China, including ocean freight, port charges and documentation."
        url={`${SITE_URL}/roro-calculator`}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">RoRo Calculator</h1>
        <p className="mt-2 text-muted-foreground">Designed for automobile exporters shipping vehicles via Roll-on/Roll-off vessels.</p>
      </div>
      <RoroCalculatorForm />

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">How this calculator works</h2>
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>
            RoRo (roll-on/roll-off) shipping moves vehicles that drive onto the vessel under their own power. Enter the
            vehicle type, dimensions and weight, choose an origin and destination RoRo port, and toggle insurance. The
            estimate adds ocean freight, origin and destination port charges, and documentation and inspection fees.
          </p>
          <p>
            Vehicle type drives the base rate — sedans and SUVs cost less than trucks, buses and EVs, which occupy more
            deck space and often require extra handling. The result shows a total estimate and a transit-time range,
            tagged &quot;Live Rate&quot; or &quot;Estimated&quot; depending on whether a matching rate exists in our
            database.
          </p>
          <p>
            Before you book, make sure your paperwork is complete — a missing title or export declaration can hold a
            vehicle at port for weeks. Use our{" "}
            <Link href="/blog/roro-vehicle-export-documents-checklist" className="text-primary underline underline-offset-2 hover:no-underline">
              RoRo documents checklist
            </Link>{" "}
            and read our{" "}
            <Link href="/blog/car-export-from-china-logistics-uae-africa" className="text-primary underline underline-offset-2 hover:no-underline">
              car export guide for the UAE and Africa
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

