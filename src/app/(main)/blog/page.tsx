import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { BlogListing } from "@/components/shared/blog-listing";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "China Shipping & Vehicle Export Guides" },
  description:
    "Practical guides on FCL vs LCL, RoRo vehicle export, Incoterms, container loading, customs clearance and shipping from China to the world.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "China Shipping & Vehicle Export Guides",
    description:
      "Practical guides on FCL vs LCL, RoRo vehicle export, Incoterms, container loading and shipping from China.",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="container py-12">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Trade & Freight Blog</h1>
        <p className="mt-2 text-muted-foreground">Practical guides for exporters, importers, and freight forwarders.</p>
      </div>
      <BlogListing posts={posts} />
    </div>
  );
}
