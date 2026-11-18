import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/contact-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "Contact Us — Freight & Vehicle Export Support" },
  description:
    "Get in touch for help with freight estimates, bulk vehicle procurement, data corrections or partnerships. We reply via WhatsApp or email.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us — Freight & Vehicle Export Support",
    description:
      "Get in touch for help with freight estimates, bulk vehicle procurement, data corrections or partnerships.",
  },
};

export default function ContactPage() {
  return (
    <div className="container max-w-xl py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="mb-8 text-muted-foreground">Questions about a rate, a data correction, or a partnership? Send us a message.</p>
      <ContactForm />
    </div>
  );
}

