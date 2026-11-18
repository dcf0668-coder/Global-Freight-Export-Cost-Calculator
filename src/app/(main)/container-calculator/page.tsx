import type { Metadata } from "next";
import Link from "next/link";
import { ContainerCalculatorForm } from "@/components/calculators/container-calculator-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WebApplicationJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Container Loading Calculator: CBM, 20GP, 40GP, 40HQ" },
  description:
    "Calculate CBM, carton counts and container loading efficiency. Compare 20GP, 40GP and 40HQ capacity to find the most efficient way to ship your cargo.",
  alternates: { canonical: "/container-calculator" },
  openGraph: {
    title: "Container Loading Calculator: CBM, 20GP, 40GP, 40HQ",
    description:
      "Calculate CBM, carton counts and container loading efficiency for 20GP, 40GP and 40HQ containers.",
  },
};

export default function ContainerCalculatorPage() {
  return (
    <div className="container py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Container Calculator", path: "/container-calculator" }]} />
      <WebApplicationJsonLd
        name="Container Loading Calculator"
        description="Calculate CBM, loading efficiency and the best container size for your cartons."
        url={`${SITE_URL}/container-calculator`}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Container Calculator</h1>
        <p className="mt-2 text-muted-foreground">Plan your carton loading and find the most efficient container size.</p>
      </div>
      <ContainerCalculatorForm />

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">How this calculator works</h2>
        <div className="mt-4 space-y-4 text-muted-foreground">
          <p>
            This tool plans carton loading by converting your carton dimensions into CBM, then comparing total volume
            and weight against the usable capacity of 20GP, 40GP and 40HQ containers. Enter carton length, width,
            height, weight and quantity, and choose whether the cartons are loaded on pallets.
          </p>
          <p>
            The result shows total CBM, total weight, loading efficiency and how many cartons fit in each container
            size. Realistic utilization is 80–90%, never 100% — pallets consume space, and dense cargo often hits the
            weight limit before the volume limit. The suggestions help you spot when a different container size or
            floor-loading would be cheaper.
          </p>
          <p>
            If your utilization comes back low, consider LCL instead of a half-empty FCL. Read our{" "}
            <Link href="/blog/how-to-calculate-container-loading-efficiency" className="text-primary underline underline-offset-2 hover:no-underline">
              container loading efficiency guide
            </Link>{" "}
            for the full methodology, and our{" "}
            <Link href="/blog/fcl-vs-lcl-which-to-choose" className="text-primary underline underline-offset-2 hover:no-underline">
              FCL vs LCL comparison
            </Link>{" "}
            to decide which booking saves you money.
          </p>
        </div>
      </section>
    </div>
  );
}

