import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
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

const CATEGORY_LABELS: Record<string, string> = {
  IMPORT: "Import",
  EXPORT: "Export",
  SHIPPING: "Shipping",
  FREIGHT: "Freight",
  AUTOMOBILE_EXPORT: "Automobile Export",
  TRADE_GUIDE: "Trade Guide",
};

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
      <Badge variant="secondary" className="mb-4">{CATEGORY_LABELS[post.category] ?? post.category}</Badge>
      <h1 className="mb-3 text-4xl font-bold tracking-tight">{post.title}</h1>
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{post.author}</span>
        <span>·</span>
        <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        <span>·</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
      <div className="space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => <h2 className="mb-3 mt-8 text-2xl font-bold text-foreground">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-2 mt-6 text-xl font-semibold text-foreground">{children}</h3>,
            p: ({ children }) => <p className="leading-relaxed text-muted-foreground">{children}</p>,
            a: ({ href, children }) => (
              <Link href={(href ?? "#") as any} className="text-primary underline underline-offset-2 hover:no-underline">
                {children}
              </Link>
            ),
            ul: ({ children }) => <ul className="list-disc space-y-1 pl-6 text-muted-foreground">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6 text-muted-foreground">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground">{children}</blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            ),
            th: ({ children }) => <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">{children}</th>,
            td: ({ children }) => <td className="border border-border px-3 py-2 text-muted-foreground">{children}</td>,
            code: ({ children }) => <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{children}</code>,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}