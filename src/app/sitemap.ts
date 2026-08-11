import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://globalfreightcalculator.com";

const STATIC_ROUTES = [
  "",
  "/calculator",
  "/roro-calculator",
  "/container-calculator",
  "/export-cost-calculator",
  "/countries",
  "/ports",
  "/shipping-lines",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries];
}
