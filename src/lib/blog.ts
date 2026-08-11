import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/types";

// ---------------------------------------------------------------------------
// File-based blog: every article is a Markdown file in /content/blog/*.md
// with YAML frontmatter for metadata. To publish a new post:
//   1. Copy content/blog/_TEMPLATE.md to content/blog/your-slug.md
//   2. Fill in the frontmatter and write the article in Markdown
//   3. git add / commit / push — the site picks it up on the next build
// No database, no login required. See content/blog/README.md for details.
// ---------------------------------------------------------------------------

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const VALID_CATEGORIES = ["IMPORT", "EXPORT", "SHIPPING", "FREIGHT", "AUTOMOBILE_EXPORT", "TRADE_GUIDE"] as const;

function isValidCategory(value: unknown): value is BlogPost["category"] {
  return typeof value === "string" && (VALID_CATEGORIES as readonly string[]).includes(value);
}

/** Rough reading time estimate: ~200 words per minute, minimum 1 minute. */
function estimateReadingTime(markdown: string): number {
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f.toLowerCase() !== "readme.md");
}

/** All published post slugs (filename without .md), excluding files starting with "_" (templates/drafts). */
export function getAllBlogSlugs(): string[] {
  return listMarkdownFiles().map((f) => f.replace(/\.md$/, ""));
}

/** Load and parse a single post by slug. Returns null if the file doesn't exist or is malformed. */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.title || !data.excerpt || !data.publishedAt) {
    console.warn(`[blog] Skipping "${slug}.md" — missing required frontmatter (title, excerpt, publishedAt).`);
    return null;
  }
  const category = isValidCategory(data.category) ? data.category : "TRADE_GUIDE";

  return {
    id: slug,
    slug,
    title: String(data.title),
    excerpt: String(data.excerpt),
    content: content.trim(),
    category,
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    publishedAt: new Date(data.publishedAt).toISOString(),
    author: data.author ? String(data.author) : "Global Freight Calculator Team",
    readingTimeMinutes: data.readingTimeMinutes ? Number(data.readingTimeMinutes) : estimateReadingTime(content),
  };
}

/** All posts, sorted newest-first. Malformed files are skipped (not thrown). */
export function getAllBlogPosts(): BlogPost[] {
  return getAllBlogSlugs()
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.category === category);
}