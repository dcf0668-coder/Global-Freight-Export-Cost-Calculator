// ---------------------------------------------------------------------------
// SEO sanity check (static). Validates that every public page has a unique,
// correctly-sized title and description, and that blog post meta titles are
// <= 60 chars. Exits with code 1 when any check fails.
//
//   node scripts/seo-check.mjs
// ---------------------------------------------------------------------------

import fs from "fs";
import path from "path";

const root = process.cwd();
const SITE_NAME = "Global Freight Calculator";
const TEMPLATE_SUFFIX = ` | ${SITE_NAME}`;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function countOf(file, marker) {
  return (read(file).match(new RegExp(marker, "g")) || []).length;
}

const countryCount = countOf("src/lib/data/countries.ts", "tariffVerified:");
const portCount = countOf("src/lib/data/ports.ts", "dataVerified:");
function approx(n) {
  return `${Math.floor(n / 10) * 10}+`;
}
const subs = {
  countryCount: approx(countryCount),
  portCount: approx(portCount),
};

const PAGES = [
  ["/", "src/app/page.tsx"],
  ["/calculator", "src/app/(main)/calculator/page.tsx"],
  ["/roro-calculator", "src/app/(main)/roro-calculator/page.tsx"],
  ["/container-calculator", "src/app/(main)/container-calculator/page.tsx"],
  ["/export-cost-calculator", "src/app/(main)/export-cost-calculator/page.tsx"],
  ["/countries", "src/app/(main)/countries/page.tsx"],
  ["/ports", "src/app/(main)/ports/page.tsx"],
  ["/shipping-lines", "src/app/(main)/shipping-lines/page.tsx"],
  ["/blog", "src/app/(main)/blog/page.tsx"],
  ["/about", "src/app/(main)/about/page.tsx"],
  ["/contact", "src/app/(main)/contact/page.tsx"],
  ["/privacy", "src/app/(main)/privacy/page.tsx"],
  ["/terms", "src/app/(main)/terms/page.tsx"],
];

const BLOG_DIR = "content/blog";

function resolveTemplate(value) {
  return value.replace(/\$\{(\w+)\}/g, (_, name) =>
    name in subs ? subs[name] : `\${${name}}`
  );
}

function extractField(source, field) {
  const abs = new RegExp(field + ':\\s*\\{\\s*absolute:\\s*(["`])([\\s\\S]*?)\\1');
  const plain = new RegExp(field + ':\\s*(["`])([\\s\\S]*?)\\1');
  const m = source.match(abs);
  if (m) return { value: resolveTemplate(m[2]), absolute: true };
  const p = source.match(plain);
  if (p) return { value: resolveTemplate(p[2]), absolute: false };
  return null;
}

function effectiveTitle(title) {
  return title.absolute ? title.value : title.value + TEMPLATE_SUFFIX;
}

const errors = [];
const rows = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

console.log(`Data counts: ${countryCount} countries -> "${approx(countryCount)}", ${portCount} ports -> "${approx(portCount)}"\n`);

for (const [route, file] of PAGES) {
  const source = read(file);
  const title = extractField(source, "title");
  const description = extractField(source, "description");
  const canonical = /canonical:\s*["`]([^"'`]+)["`]/.test(source);
  const hasOg = /openGraph\s*:/.test(source);

  if (!title) {
    errors.push(`${route}: missing title`);
    continue;
  }
  const titleText = effectiveTitle(title);
  const titleLen = titleText.length;

  if (titleLen > 60) errors.push(`${route}: title is ${titleLen} chars (> 60): "${titleText}"`);

  if (!description) {
    errors.push(`${route}: missing description`);
  } else {
    const descLen = description.value.length;
    if (descLen < 120 || descLen > 155) {
      errors.push(`${route}: description is ${descLen} chars (must be 120-155)`);
    }
    if (seenDescriptions.has(description.value)) {
      errors.push(`${route}: duplicate description (also used by ${seenDescriptions.get(description.value)})`);
    }
    seenDescriptions.set(description.value, route);
  }

  if (seenTitles.has(titleText)) {
    errors.push(`${route}: duplicate title (also used by ${seenTitles.get(titleText)})`);
  }
  seenTitles.set(titleText, route);

  rows.push({
    route,
    title: titleText,
    titleLen,
    descLen: description ? description.value.length : 0,
    canonical,
    og: hasOg,
  });
}

// Blog post titles (seoTitle ?? title) must be <= 60 chars.
const blogFiles = fs
  .readdirSync(path.join(root, BLOG_DIR))
  .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f.toLowerCase() !== "readme.md");

for (const file of blogFiles) {
  const source = read(`${BLOG_DIR}/${file}`);
  const title = extractField(source, "title");
  const seoTitle = extractField(source, "seoTitle");
  const metaTitle = seoTitle ? seoTitle.value : title ? title.value : null;
  if (!metaTitle) {
    errors.push(`blog/${file}: missing title`);
    continue;
  }
  if (metaTitle.length > 60) {
    errors.push(`blog/${file}: meta title is ${metaTitle.length} chars (> 60): "${metaTitle}"`);
  }
}

console.log("Route".padEnd(24), "| Title".padEnd(58), "| T", "| D", "| Can", "| OG");
console.log("-".repeat(120));
for (const r of rows) {
  console.log(
    r.route.padEnd(24),
    "|",
    r.title.slice(0, 56).padEnd(58),
    "|",
    String(r.titleLen).padStart(3),
    "|",
    String(r.descLen).padStart(3),
    "|",
    r.canonical ? " y" : " n",
    "|",
    r.og ? " y" : " n"
  );
}

console.log(`\nChecked ${rows.length} pages and ${blogFiles.length} blog posts.`);

if (errors.length > 0) {
  console.error("\nFAILED:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
} else {
  console.log("\nAll SEO checks passed.");
}
