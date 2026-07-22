import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "fcl-vs-lcl-which-to-choose",
    title: "FCL vs LCL: Which Shipping Method Should You Choose?",
    excerpt: "A practical breakdown of full-container-load and less-than-container-load shipping, with cost thresholds to help you decide.",
    content: "## FCL vs LCL\n\nWhen exporting from China, one of the first decisions you'll face is whether to book a full container (FCL) or share container space (LCL)...",
    category: "FREIGHT",
    publishedAt: "2026-05-12T00:00:00.000Z",
    author: "Global Freight Calculator Team",
    readingTimeMinutes: 6,
  },
  {
    id: "2",
    slug: "roro-vehicle-export-documents-checklist",
    title: "RoRo Vehicle Export: The Complete Documents Checklist",
    excerpt: "Everything automobile exporters need before booking a RoRo shipment, from title transfer to destination customs.",
    content: "## RoRo Export Documents\n\nExporting vehicles via Roll-on/Roll-off (RoRo) vessels requires a specific document set...",
    category: "AUTOMOBILE_EXPORT",
    publishedAt: "2026-06-02T00:00:00.000Z",
    author: "Global Freight Calculator Team",
    readingTimeMinutes: 8,
  },
  {
    id: "3",
    slug: "understanding-incoterms-2020",
    title: "Understanding Incoterms 2020: EXW, FOB, CIF Explained",
    excerpt: "A trader's guide to the most commonly used Incoterms and how they shift cost and risk between buyer and seller.",
    content: "## Incoterms 2020\n\nIncoterms define who pays for what, and when risk transfers from seller to buyer...",
    category: "TRADE_GUIDE",
    publishedAt: "2026-04-20T00:00:00.000Z",
    author: "Global Freight Calculator Team",
    readingTimeMinutes: 7,
  },
  {
    id: "4",
    slug: "how-to-calculate-container-loading-efficiency",
    title: "How to Calculate Container Loading Efficiency",
    excerpt: "Maximize container utilization and reduce your per-unit shipping cost with these CBM planning techniques.",
    content: "## Container Loading Efficiency\n\nContainer utilization directly affects your landed cost per unit...",
    category: "SHIPPING",
    publishedAt: "2026-03-15T00:00:00.000Z",
    author: "Global Freight Calculator Team",
    readingTimeMinutes: 5,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
