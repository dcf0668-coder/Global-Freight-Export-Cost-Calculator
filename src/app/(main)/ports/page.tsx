import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ports } from "@/lib/data/ports";

export const metadata: Metadata = {
  title: "Port Database — Searchable Worldwide Ports",
  description: "Search ports by country, UNLOCODE, coordinates, nearby airports and warehouses, and RoRo/container availability.",
  alternates: { canonical: "/ports" },
};

export default function PortsPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Port Database</h1>
        <p className="mt-2 text-muted-foreground">Searchable directory of ports with UNLOCODE, coordinates, and service availability.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ports.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">{p.name}</h2>
                <Badge variant="secondary">{p.unlocode}</Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{p.countryName}</p>
              <dl className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex justify-between"><dt>Coordinates</dt><dd className="text-foreground">{p.latitude.toFixed(2)}, {p.longitude.toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt>Nearby Airport</dt><dd className="text-right text-foreground">{p.nearbyAirports[0] ?? "—"}</dd></div>
                <div className="flex justify-between"><dt>Nearby Warehouse</dt><dd className="text-right text-foreground">{p.nearbyWarehouses[0] ?? "—"}</dd></div>
              </dl>
              <div className="mt-3 flex gap-2">
                {p.containerAvailable && <Badge variant="outline">Container</Badge>}
                {p.roroAvailable && <Badge variant="outline">RoRo</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
