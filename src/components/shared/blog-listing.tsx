"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  IMPORT: "Import",
  EXPORT: "Export",
  SHIPPING: "Shipping",
  FREIGHT: "Freight",
  AUTOMOBILE_EXPORT: "Automobile Export",
  TRADE_GUIDE: "Trade Guide",
};

export function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = React.useState<string>("all");

  const categoriesPresent = React.useMemo(() => Array.from(new Set(posts.map((p) => p.category))), [posts]);
  const filtered = category === "all" ? posts : posts.filter((p) => p.category === category);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium",
            category === "all" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
          )}
        >
          All
        </button>
        {categoriesPresent.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              category === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"
            )}
          >
            {CATEGORY_LABELS[c] ?? c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}` as any}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3">{CATEGORY_LABELS[post.category] ?? post.category}</Badge>
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
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}