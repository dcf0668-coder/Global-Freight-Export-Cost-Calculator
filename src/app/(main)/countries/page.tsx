import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { countries } from "@/lib/data/countries";
import { getPortsByCountry } from "@/lib/data/ports";

export const metadata: Metadata = {
  title: "Country Database — Import Regulations Worldwide",
  description: "Browse import duty rates, VAT, required documents, voltage, and driving side for countries worldwide, with popular ports for China exporters.",
  alternates: { canonical: "/countries" },
};

export default function CountriesPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Country Database</h1>
        <p className="mt-2 text-muted-foreground">Import regulations, duty rates, and required documents by destination country.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => {
          const popularPorts = getPortsByCountry(c.id);
          return (
            <Link key={c.id} href={`/countries#${c.isoCode}` as any}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold">{c.name}</h2>
                    <Badge variant="secondary">{c.isoCode}</Badge>
                  </div>
                  <dl className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex justify-between"><dt>Region</dt><dd className="text-foreground">{c.region}</dd></div>
                    <div className="flex justify-between"><dt>Currency</dt><dd className="text-foreground">{c.currency}</dd></div>
                    <div className="flex justify-between"><dt>Import Duty</dt><dd className="text-foreground">{c.importDutyRate}%</dd></div>
                    <div className="flex justify-between"><dt>VAT</dt><dd className="text-foreground">{c.vatRate}%</dd></div>
                    <div className="flex justify-between"><dt>Voltage</dt><dd className="text-foreground">{c.voltage}</dd></div>
                    <div className="flex justify-between"><dt>Driving Side</dt><dd className="text-foreground">{c.drivingSide}</dd></div>
                    <div className="flex justify-between"><dt>Popular Ports</dt><dd className="text-foreground">{popularPorts.length}</dd></div>
                  </dl>
                  {c.requiresInspection && (
                    <Badge variant="outline" className="mt-3">Inspection Required</Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
