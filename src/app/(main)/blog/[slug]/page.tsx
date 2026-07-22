import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/blog";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.publishedAt },
  };
}

/** Minimal markdown-to-JSX renderer for the limited subset used in seed content (##, paragraphs). */
function renderMarkdown(markdown: string) {
  return markdown.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return <h2 key={i} className="mb-3 mt-8 text-2xl font-bold">{block.replace("## ", "")}</h2>;
    }
    return <p key={i} className="mb-4 leading-relaxed text-muted-foreground">{block}</p>;
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
  };

  return (
    <article className="container max-w-3xl py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/blog" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Blog
      </Link>
      <Badge variant="secondary" className="mb-4">{post.category.replace("_", " ")}</Badge>
      <h1 className="mb-3 text-4xl font-bold tracking-tight">{post.title}</h1>
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author}</span>
        <span>·</span>
        <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        <span>·</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
      <div className="prose-content">{renderMarkdown(post.content)}</div>
    </article>
  );
}
