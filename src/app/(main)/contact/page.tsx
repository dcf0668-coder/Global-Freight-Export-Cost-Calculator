import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Global Freight Calculator team for partnership, data, or support inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container max-w-xl py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="mb-8 text-muted-foreground">Questions about a rate, a data correction, or a partnership? Send us a message.</p>
      <ContactForm />
    </div>
  );
}
