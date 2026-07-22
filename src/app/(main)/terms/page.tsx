import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Global Freight Calculator.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Terms of Service</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Estimates Are Non-Binding</h2>
          <p>All figures produced by our calculators are indicative estimates only. Actual freight rates, duties, taxes, and fees vary by carrier, season, fuel surcharge, and destination customs authority. Global Freight Calculator makes no guarantee of accuracy and is not a party to any shipment or contract of carriage.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Acceptable Use</h2>
          <p>You agree not to misuse the platform, including scraping data at scale without permission, attempting to breach security, or using the service for unlawful shipments.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Intellectual Property</h2>
          <p>The site's design, code, and compiled database are the property of Global Freight Calculator unless otherwise noted.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Limitation of Liability</h2>
          <p>Global Freight Calculator is not liable for decisions made based on estimates provided by this tool, including but not limited to shipment bookings, pricing, or customs declarations.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Changes to These Terms</h2>
          <p>We may update these terms from time to time; continued use of the site constitutes acceptance of the revised terms.</p>
        </section>
      </div>
    </div>
  );
}
