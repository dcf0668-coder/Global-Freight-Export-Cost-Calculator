import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Global Freight Calculator.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Information We Collect</h2>
          <p>We collect information you provide directly, such as contact form submissions and account registration details, and limited usage data (e.g. pages visited, calculator inputs) to improve our service.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">How We Use Information</h2>
          <p>We use collected information to operate and improve the calculators and databases, respond to inquiries, and — where you've consented — send product updates.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Data Sharing</h2>
          <p>We do not sell personal information. We may share data with service providers (e.g. hosting, authentication, analytics) strictly to operate the platform.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Contact</h2>
          <p>Questions about this policy can be directed via our Contact page.</p>
        </section>
      </div>
    </div>
  );
}
