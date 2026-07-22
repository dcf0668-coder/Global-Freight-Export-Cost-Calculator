import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://globalfreightcalculator.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Global Freight Calculator — Shipping Cost Estimator from China",
    template: "%s | Global Freight Calculator",
  },
  description:
    "Free freight calculator for exporters shipping from China. Estimate container, LCL, RoRo, air, and rail shipping costs, transit times, and landed cost instantly.",
  keywords: [
    "freight calculator",
    "shipping cost calculator",
    "China export shipping",
    "container shipping cost",
    "RoRo vehicle export",
    "landed cost calculator",
    "FCL LCL calculator",
  ],
  authors: [{ name: "Global Freight Calculator" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Global Freight Calculator",
    title: "Global Freight Calculator — Shipping Cost Estimator from China",
    description: "Estimate international shipping costs from China in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Freight Calculator",
    description: "Estimate international shipping costs from China in seconds.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
