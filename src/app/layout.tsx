import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppCta } from "@/components/shared/whatsapp-cta";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Shipping Cost from China | Free Freight Calculator",
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Free freight and export cost calculators for shipping from China. Estimate container, LCL, RoRo, air and rail costs, transit times and landed cost.",

  keywords: [
    "freight calculator",
    "shipping cost calculator",
    "China export shipping",
    "container shipping cost",
    "RoRo vehicle export",
    "landed cost calculator",
    "FCL calculator",
    "LCL calculator",
    "shipping estimator",
    "international logistics",
  ],

  authors: [{ name: SITE_NAME }],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Shipping Cost from China | Free Freight Calculator",
    description:
      "Estimate container, LCL, RoRo, air and rail shipping costs from China in seconds.",
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Estimate container, LCL, RoRo, air and rail shipping costs from China in seconds.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <section className="border-t border-border/60 bg-muted/30">
              <div className="container flex flex-col items-center justify-between gap-4 py-10 text-center md:flex-row md:text-left">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Sourcing vehicles in bulk from China?
                  </h2>
                  <p className="mt-1 max-w-xl text-muted-foreground">
                    Chat with our team on WhatsApp for bulk vehicle procurement support and tailored logistics guidance.
                  </p>
                </div>
                <WhatsAppCta source="footer-banner" variant="banner" className="shrink-0" />
              </div>
            </section>
            <Footer />
          </div>
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  );
}