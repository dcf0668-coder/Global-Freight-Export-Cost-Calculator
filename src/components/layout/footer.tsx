import Link from "next/link";
import { Ship } from "lucide-react";

const FOOTER_SECTIONS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Calculators",
    links: [
      { href: "/calculator", label: "Freight Calculator" },
      { href: "/roro-calculator", label: "RoRo Calculator" },
      { href: "/container-calculator", label: "Container Calculator" },
      { href: "/export-cost-calculator", label: "Export Cost Calculator" },
    ],
  },
  {
    title: "Databases",
    links: [
      { href: "/countries", label: "Country Database" },
      { href: "/ports", label: "Port Database" },
      { href: "/shipping-lines", label: "Shipping Lines" },
      { href: "/blog", label: "Trade Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Ship className="h-6 w-6 text-primary" />
            <span>Global Freight Calculator</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Free shipping cost estimation tools for exporters, importers, and freight forwarders shipping from China worldwide.
          </p>
        </div>
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h4 className="mb-3 text-sm font-semibold">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href as any} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Global Freight Calculator. All estimates are indicative and non-binding.</p>
          <p>Built for exporters shipping from China to the world.</p>
        </div>
      </div>
    </footer>
  );
}
