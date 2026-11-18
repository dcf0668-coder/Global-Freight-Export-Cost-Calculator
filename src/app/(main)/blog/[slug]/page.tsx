import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BlogPostingJsonLd } from "@/components/seo/json-ld";
import { WhatsAppCta } from "@/components/shared/whatsapp-cta";
import { getAllBlogPosts, getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";
import type { BlogPost } from "@/types";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const title = post.seoTitle ?? post.title;
  return {
    title: { absolute: title },
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: post.coverImage
        ? [{ url: post.coverImage }]
        : [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
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

const CATEGORY_CALCULATOR: Record<string, { href: string; label: string }> = {
  IMPORT: { href: "/calculator", label: "Freight Calculator" },
  EXPORT: { href: "/export-cost-calculator", label: "Export Cost Calculator" },
  SHIPPING: { href: "/calculator", label: "Freight Calculator" },
  FREIGHT: { href: "/calculator", label: "Freight Calculator" },
  AUTOMOBILE_EXPORT: { href: "/roro-calculator", label: "RoRo Calculator" },
  TRADE_GUIDE: { href: "/export-cost-calculator", label: "Export Cost Calculator" },
};

function getRelatedPosts(current: BlogPost, all: BlogPost[]): BlogPost[] {
  const others = all.filter((p) => p.slug !== current.slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, 3);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllBlogPosts();
  const related = getRelatedPosts(post, allPosts);
  const calculator = CATEGORY_CALCULATOR[post.category] ?? { href: "/calculator", label: "Freight Calculator" };
  const isVehicle = post.category === "AUTOMOBILE_EXPORT";

  return (
    <article className="container max-w-3xl py-12">
      <BlogPostingJsonLd post={post} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
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
            img: ({ src, alt }) => {
              if (!alt) {
                console.warn(`[blog] Image is missing alt text in "${post.slug}" (src: ${src ?? "none"}).`);
              }
              return <img src={src as string} alt={alt ?? ""} className="my-4 max-w-full rounded-lg" />;
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <section className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
        <h2 className="text-lg font-semibold">
          {isVehicle ? "Sourcing vehicles in bulk from China?" : "Need a quote for your shipment?"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isVehicle
            ? "Chat with our team on WhatsApp for bulk vehicle procurement support and tailored logistics guidance."
            : "Chat with our team on WhatsApp for a tailored freight estimate for your cargo."}
        </p>
        <div className="mt-4">
          <WhatsAppCta source={`blog-${post.slug}`} variant="primary" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">Related articles</h2>
          <ul className="mt-4 space-y-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}` as any}
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link
              href={calculator.href as any}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Try the {calculator.label} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}