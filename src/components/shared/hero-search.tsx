"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CountryCombobox } from "@/components/shared/country-combobox";
import { countries } from "@/lib/data/countries";

export function HeroSearch() {
  const router = useRouter();
  const [destination, setDestination] = React.useState<string>("");

  function handleSearch() {
    const query = destination ? `?destination=${destination}` : "";
    router.push(`/calculator${query}` as any);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-lg sm:flex-row">
      <div className="flex-1">
        <CountryCombobox countries={countries} value={destination} onChange={setDestination} placeholder="Where are you shipping to?" />
      </div>
      <Button size="lg" onClick={handleSearch} className="shrink-0">
        Get Estimate
      </Button>
    </div>
  );
}