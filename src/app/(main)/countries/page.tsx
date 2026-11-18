import type { Metadata } from "next";
import { countries } from "@/lib/data/countries";
import { CountryBrowser } from "@/components/shared/country-browser";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WhatsAppCta } from "@/components/shared/whatsapp-cta";
import { approximateCount } from "@/lib/site";

const countryCount = approximateCount(countries.length);

export const metadata: Metadata = {
  title: { absolute: `Import Duty, VAT & Documents by Country (${countryCount})` },
  description: `Browse import duty rates, VAT, required documents, voltage and driving side for ${countryCount} countries and territories, searchable by region.`,
  alternates: { canonical: "/countries" },
  openGraph: {
    title: `Import Duty, VAT & Documents by Country (${countryCount})`,
    description: `Import duty rates, VAT, required documents and driving side for ${countryCount} countries and territories.`,
  },
};

export default function CountriesPage() {
  return (
    <div className="container py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Countries", path: "/countries" }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Country Database</h1>
        <p className="mt-2 text-muted-foreground">
          Import regulations, duty rates, and required documents for {countries.length} countries and territories.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Duty/VAT rates marked <span className="italic">(est.)</span> are regional-average placeholders pending verification against an authoritative tariff database — treat them as directional, not final.
        </p>
      </div>

      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 p-6 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-semibold">Need a quote for a specific lane?</p>
          <p className="text-sm text-muted-foreground">Get a bulk vehicle procurement estimate on WhatsApp.</p>
        </div>
        <WhatsAppCta source="countries" variant="outline" />
      </div>

      <CountryBrowser countries={countries} />
    </div>
  );
}

