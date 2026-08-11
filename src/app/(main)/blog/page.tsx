import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { BlogListing } from "@/components/shared/blog-listing";

export const metadata: Metadata = {
  title: "Trade & Freight Blog",
  description: "Guides on FCL vs LCL, RoRo vehicle export, Incoterms, container loading, and international trade for exporters and freight forwarders.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Trade & Freight Blog</h1>
        <p className="mt-2 text-muted-foreground">Practical guides for exporters, importers, and freight forwarders.</p>
      </div>
      <BlogListing posts={posts} />
    </div>
  );
}