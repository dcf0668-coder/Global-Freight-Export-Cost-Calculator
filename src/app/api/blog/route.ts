import { NextRequest, NextResponse } from "next/server";
import { blogPosts } from "@/lib/data/blog";

/**
 * GET /api/blog
 * GET /api/blog?slug=fcl-vs-lcl-which-to-choose
 * GET /api/blog?category=FREIGHT
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");

  if (slug) {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  }

  const filtered = category ? blogPosts.filter((p) => p.category === category) : blogPosts;
  return NextResponse.json(filtered);
}
