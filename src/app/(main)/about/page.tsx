import type { Metadata } from "next";
import { Globe2, Ship, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Global Freight Calculator helps exporters, importers, and freight forwarders estimate China-origin international shipping costs instantly.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">About Global Freight Calculator</h1>
      <p className="mb-6 text-muted-foreground">
        Global Freight Calculator is a free logistics tool built for importers, exporters, freight forwarders,
        sourcing agents, and trading companies who need to estimate shipping costs from China to destinations
        worldwide — quickly, and without waiting on a broker quote.
      </p>
      <p className="mb-10 text-muted-foreground">
        Our calculators cover full-container and shared-container ocean freight, RoRo vehicle exports, container
        loading planning, and full landed-cost modeling — combining industry-standard cost logic with an
        up-to-date port, country, and shipping-line database.
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        <Feature icon={Globe2} title="Global Coverage" desc="Destination data spanning every major trading region." />
        <Feature icon={Ship} title="Every Cargo Type" desc="FCL, LCL, RoRo, air, and rail freight modeling." />
        <Feature icon={ShieldCheck} title="Transparent Estimates" desc="Clear cost breakdowns, not black-box numbers." />
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <Icon className="mb-3 h-6 w-6 text-primary" />
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
