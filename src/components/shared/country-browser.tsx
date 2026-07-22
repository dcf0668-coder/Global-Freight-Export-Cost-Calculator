"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Country } from "@/types";

export function CountryBrowser({ countries }: { countries: Country[] }) {
  const [query, setQuery] = React.useState("");
  const [region, setRegion] = React.useState<string>("all");

  const regions = React.useMemo(() => {
    const unique = Array.from(new Set(countries.map((c) => c.region))).sort();
    return unique;
  }, [countries]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.isoCode.toLowerCase().includes(q);
      const matchesRegion = region === "all" || c.region === region;
      return matchesQuery && matchesRegion;
    });
  }, [countries, query, region]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by country name or ISO code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filtered.length} of {countries.length} countries
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">{c.name}</h2>
                <Badge variant="secondary">{c.isoCode}</Badge>
              </div>
              <dl className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex justify-between"><dt>Region</dt><dd className="text-foreground">{c.region}</dd></div>
                <div className="flex justify-between"><dt>Currency</dt><dd className="text-foreground">{c.currency}</dd></div>
                <div className="flex justify-between">
                  <dt>Import Duty</dt>
                  <dd className="text-foreground">
                    {c.importDutyRate}% {!c.tariffVerified && <span className="text-xs text-muted-foreground">(est.)</span>}
                  </dd>
                </div>
                <div className="flex justify-between"><dt>VAT</dt><dd className="text-foreground">{c.vatRate}%</dd></div>
                <div className="flex justify-between"><dt>Voltage</dt><dd className="text-foreground">{c.voltage}</dd></div>
                <div className="flex justify-between"><dt>Driving Side</dt><dd className="text-foreground">{c.drivingSide}</dd></div>
              </dl>
              {c.requiresInspection && <Badge variant="outline" className="mt-3">Inspection Required</Badge>}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">No countries match your search.</p>
        )}
      </div>
    </div>
  );
}
