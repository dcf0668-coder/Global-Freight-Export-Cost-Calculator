"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Port } from "@/types";

const PAGE_SIZE = 30;

export function PortBrowser({ ports }: { ports: Port[] }) {
  const [query, setQuery] = React.useState("");
  const [countryFilter, setCountryFilter] = React.useState<string>("all");
  const [capability, setCapability] = React.useState<string>("all");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const countryOptions = React.useMemo(() => {
    const unique = Array.from(new Set(ports.map((p) => p.countryName))).sort();
    return unique;
  }, [ports]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ports.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.unlocode.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q);
      const matchesCountry = countryFilter === "all" || p.countryName === countryFilter;
      const matchesCapability =
        capability === "all" ||
        (capability === "roro" && p.roroAvailable) ||
        (capability === "container" && p.containerAvailable);
      return matchesQuery && matchesCountry && matchesCapability;
    });
  }, [ports, query, countryFilter, capability]);

  React.useEffect(() => setVisibleCount(PAGE_SIZE), [query, countryFilter, capability]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by port name, UNLOCODE, or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">All Countries</SelectItem>
            {countryOptions.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={capability} onValueChange={setCapability}>
          <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Capability</SelectItem>
            <SelectItem value="container">Container</SelectItem>
            <SelectItem value="roro">RoRo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {visible.length} of {filtered.length} matching ports ({ports.length} total)
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">{p.name}</h2>
                <Badge variant="secondary">{p.unlocode}</Badge>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{p.countryName}</p>
              <dl className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <dt>Coordinates</dt>
                  <dd className="text-foreground">
                    {p.latitude.toFixed(2)}, {p.longitude.toFixed(2)}
                    {!p.dataVerified && <span className="ml-1 text-xs">(est.)</span>}
                  </dd>
                </div>
                {p.nearbyAirports[0] && (
                  <div className="flex justify-between"><dt>Nearby Airport</dt><dd className="text-right text-foreground">{p.nearbyAirports[0]}</dd></div>
                )}
                {p.nearbyWarehouses[0] && (
                  <div className="flex justify-between"><dt>Nearby Warehouse</dt><dd className="text-right text-foreground">{p.nearbyWarehouses[0]}</dd></div>
                )}
              </dl>
              <div className="mt-3 flex gap-2">
                {p.containerAvailable && <Badge variant="outline">Container</Badge>}
                {p.roroAvailable && <Badge variant="outline">RoRo</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">No ports match your search.</p>
        )}
      </div>

      {visibleCount < filtered.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
