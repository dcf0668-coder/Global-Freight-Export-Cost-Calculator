import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { shippingLines } from "@/lib/data/shippingLines";

export const metadata: Metadata = {
  title: "Shipping Line Database — COSCO, MSC, Maersk & More",
  description: "Company profiles, coverage regions, and tracking links for major container and RoRo shipping lines serving China export routes.",
  alternates: { canonical: "/shipping-lines" },
};

export default function ShippingLinesPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shipping Line Database</h1>
        <p className="mt-2 text-muted-foreground">Company profiles and tracking links for major carriers serving China trade lanes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shippingLines.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-6">
              <h2 className="mb-2 font-semibold">{s.name}</h2>
              <p className="mb-3 text-sm text-muted-foreground">{s.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {s.offersContainer && <Badge variant="outline">Container</Badge>}
                {s.offersRoro && <Badge variant="outline">RoRo</Badge>}
                {s.coverageRegions.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={s.website} target="_blank" rel="noopener noreferrer">
                    Website <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={s.trackingUrl} target="_blank" rel="noopener noreferrer">
                    Track Shipment
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
