# Blog Content

Every article on `/blog` is a Markdown file in this folder. There's no
database, login, or admin panel involved — the site reads these files
directly at build time.

## Publish a new article

1. Copy `_TEMPLATE.md` to a new file named after your article's URL slug,
   e.g. `hs-code-lookup-guide.md`. The filename (minus `.md`) becomes the
   URL: `/blog/hs-code-lookup-guide`.
2. Fill in the frontmatter block at the top of the file:
```yaml
   ---
   title: "Your Article Title"
   excerpt: "One or two sentences for the listing page and SEO description."
   category: TRADE_GUIDE
   publishedAt: "2026-08-10"
   author: "Global Freight Calculator Team"
   ---
```
   `category` must be one of: `IMPORT`, `EXPORT`, `SHIPPING`, `FREIGHT`,
   `AUTOMOBILE_EXPORT`, `TRADE_GUIDE`.
3. Write the article below the frontmatter in normal Markdown — headings,
   bold/italic, links, bullet/numbered lists, blockquotes, and tables are
   all supported.
4. `git add`, `git commit`, `git push`. On the next deploy, the article
   appears on `/blog`, sorted by `publishedAt` (newest first), and gets its
   own page, SEO metadata, and JSON-LD structured data automatically.

## Notes

- Files starting with `_` (like `_TEMPLATE.md`) are ignored — use that
  prefix for drafts you don't want published yet, e.g. `_my-draft.md`, then
  rename (remove the `_`) when it's ready to go live.
- Reading time is calculated automatically from word count. To override it,
  add `readingTimeMinutes: 8` to the frontmatter.
- To add a cover image, drop the file in `/public/blog/` and reference it
  in frontmatter as `coverImage: "/blog/your-image.jpg"`.
- If a post's frontmatter is missing `title`, `excerpt`, or `publishedAt`,
  it's silently skipped from the site (with a console warning during build)
  rather than breaking the whole blog — check your build log if a post
  isn't showing up.