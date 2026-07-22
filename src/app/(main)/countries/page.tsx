import type { Metadata } from "next";
import { countries } from "@/lib/data/countries";
import { CountryBrowser } from "@/components/shared/country-browser";

export const metadata: Metadata = {
  title: "Country Database — Import Regulations Worldwide",
  description: "Browse import duty rates, VAT, required documents, voltage, and driving side for 240+ countries and territories, searchable by region.",
  alternates: { canonical: "/countries" },
};

export default function CountriesPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Country Database</h1>
        <p className="mt-2 text-muted-foreground">
          Import regulations, duty rates, and required documents for {countries.length} countries and territories.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Duty/VAT rates marked <span className="italic">(est.)</span> are regional-average placeholders pending verification against an authoritative tariff database — treat them as directional, not final.
        </p>
      </div>
      <CountryBrowser countries={countries} />
    </div>
  );
}
