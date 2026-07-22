import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Trade & Freight Blog",
  description: "Guides on FCL vs LCL, RoRo vehicle export, Incoterms, container loading, and international trade for exporters and freight forwarders.",
  alternates: { canonical: "/blog" },
};

const CATEGORY_LABELS: Record<string, string> = {
  IMPORT: "Import",
  EXPORT: "Export",
  SHIPPING: "Shipping",
  FREIGHT: "Freight",
  AUTOMOBILE_EXPORT: "Automobile Export",
  TRADE_GUIDE: "Trade Guide",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Trade & Freight Blog</h1>
        <p className="mt-2 text-muted-foreground">Practical guides for exporters, importers, and freight forwarders.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}` as any}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3">{CATEGORY_LABELS[post.category]}</Badge>
                <h2 className="mb-2 font-semibold leading-snug">{post.title}</h2>
                <p className="mb-3 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span>{post.readingTimeMinutes} min read</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
