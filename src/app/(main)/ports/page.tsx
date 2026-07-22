import type { Metadata } from "next";
import { ports } from "@/lib/data/ports";
import { PortBrowser } from "@/components/shared/port-browser";

export const metadata: Metadata = {
  title: "Port Database — Searchable Worldwide Ports",
  description: "Search 500+ ports by name, UNLOCODE, country, and RoRo/container availability.",
  alternates: { canonical: "/ports" },
};

export default function PortsPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Port Database</h1>
        <p className="mt-2 text-muted-foreground">
          Searchable directory of {ports.length} ports across {new Set(ports.map((p) => p.countryName)).size} countries and territories.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Coordinates marked <span className="italic">(est.)</span> are city-level estimates pending verification against the official UN/LOCODE registry — treat them as directional, not survey-grade.
        </p>
      </div>
      <PortBrowser ports={ports} />
    </div>
  );
}
