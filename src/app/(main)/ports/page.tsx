import type { Metadata } from "next";
import { ports } from "@/lib/data/ports";
import { PortBrowser } from "@/components/shared/port-browser";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WhatsAppCta } from "@/components/shared/whatsapp-cta";
import { approximateCount } from "@/lib/site";

const portCount = approximateCount(ports.length);

export const metadata: Metadata = {
  title: { absolute: "World Port Database: UNLOCODE, RoRo & Container Ports" },
  description: `Search ${portCount} world ports by name, UNLOCODE, country and RoRo or container availability. Find destination ports for China export shipping routes.`,
  alternates: { canonical: "/ports" },
  openGraph: {
    title: "World Port Database: UNLOCODE, RoRo & Container Ports",
    description: `Search ${portCount} world ports by name, UNLOCODE, country and RoRo or container availability.`,
  },
};

export default function PortsPage() {
  return (
    <div className="container py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Ports", path: "/ports" }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Port Database</h1>
        <p className="mt-2 text-muted-foreground">
          Searchable directory of {ports.length} ports across {new Set(ports.map((p) => p.countryName)).size} countries and territories.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Coordinates marked <span className="italic">(est.)</span> are city-level estimates pending verification against the official UN/LOCODE registry — treat them as directional, not survey-grade.
        </p>
      </div>

      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-semibold">Shipping from China to a port not listed?</p>
          <p className="text-sm text-muted-foreground">Chat with us on WhatsApp for bulk vehicle procurement.</p>
        </div>
        <WhatsAppCta source="ports" variant="outline" />
      </div>

      <PortBrowser ports={ports} />
    </div>
  );
}

