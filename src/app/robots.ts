
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const commonDisallow = [
  "/admin/",
  "/api/",
  "/*?utm_",
  "/*?fbclid=",
];

const aiUserAgents = [
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: commonDisallow,
      },
      ...aiUserAgents.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: commonDisallow,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
