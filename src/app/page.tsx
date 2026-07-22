import Link from "next/link";
import { ArrowRight, Container, Globe2, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSearch } from "@/components/shared/hero-search";
import { countries } from "@/lib/data/countries";
import { ports } from "@/lib/data/ports";
import { shippingLines } from "@/lib/data/shippingLines";

const STATS = [
  { label: "Supported Countries", value: `${countries.length}+`, icon: Globe2 },
  { label: "Supported Ports", value: `${ports.length}+`, icon: Ship },
  { label: "Shipping Lines", value: `${shippingLines.length}+`, icon: Container },
  { label: "Container Types", value: "4", icon: Truck },
];

const CALCULATORS = [
  { href: "/calculator", title: "Freight Calculator", desc: "Estimate FCL, LCL, air, and rail shipping costs door-to-door." },
  { href: "/roro-calculator", title: "RoRo Calculator", desc: "Vehicle export cost estimation for automobile exporters." },
  { href: "/container-calculator", title: "Container Calculator", desc: "Plan CBM, carton counts, and container utilization." },
  { href: "/export-cost-calculator", title: "Export Cost Calculator", desc: "Full landed cost from EXW to destination selling price." },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Global Freight Calculator",
    description: "Free shipping cost estimation tools for exporters, importers, and freight forwarders shipping from China worldwide.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://globalfreightcalculator.com",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="gradient-hero relative overflow-hidden py-20 md:py-28">
        <div className="container relative text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Calculate Shipping Cost from China to Anywhere
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            Estimate international shipping costs in seconds.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <HeroSearch />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/calculator">
                Start Calculating <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/countries">Browse Countries</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-12">
        <div className="container grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <stat.icon className="mb-2 h-6 w-6 text-primary" />
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Every Calculator an Exporter Needs</h2>
          <p className="mt-2 text-muted-foreground">Purpose-built tools for each stage of your shipment planning.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CALCULATORS.map((c) => (
            <Link key={c.href} href={c.href as any}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    Try it <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
