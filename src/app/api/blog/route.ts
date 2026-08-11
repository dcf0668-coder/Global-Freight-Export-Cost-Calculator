import { NextRequest, NextResponse } from "next/server";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";

/**
 * GET /api/blog
 * GET /api/blog?slug=fcl-vs-lcl-which-to-choose
 * GET /api/blog?category=FREIGHT
 *
 * Reads from the Markdown files in /content/blog -- see content/blog/README.md
 * for how to publish a new post.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");

  if (slug) {
    const post = getBlogPostBySlug(slug);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  }

  const posts = getAllBlogPosts();
  const filtered = category ? posts.filter((p) => p.category === category) : posts;
  return NextResponse.json(filtered);
}
