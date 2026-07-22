"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <div className="flex flex-1 items-center gap-2 px-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger className="border-0 shadow-none focus:ring-0">
            <SelectValue placeholder="Where are you shipping to?" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button size="lg" onClick={handleSearch} className="shrink-0">
        Get Estimate
      </Button>
    </div>
  );
}
