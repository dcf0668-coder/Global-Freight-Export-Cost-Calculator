# Global Freight Calculator

A shipping cost and export cost estimation platform for exporters, importers, and freight forwarders shipping from China worldwide.

## Tech Stack

- **Next.js 15** (App Router) + React + TypeScript (strict mode)
- **Tailwind CSS** + shadcn/ui-style components (Radix primitives)
- **Framer Motion** for UI animation, **Lucide** for icons
- **Prisma ORM** + **PostgreSQL** (designed for Supabase)
- **Supabase Auth** (`@supabase/ssr`)
- REST API routes under `/api/*`

## What's fully working right now

- All 4 calculators (Freight, RoRo, Container/CBM, Export Landed Cost) with real cost-modeling logic — not placeholders. See `src/lib/calculations/`.
- Country / Port / Shipping Line / Blog browse pages, populated with realistic sample data (`src/lib/data/`).
- REST API: `/api/calculate`, `/api/countries`, `/api/ports`, `/api/shipping-lines`, `/api/blog`, `/api/search`.
- Dark/light mode, responsive layout, SEO (metadata, `robots.ts`, `sitemap.ts`, JSON-LD on blog posts, canonical URLs).
- Full Prisma schema modeling every entity in the spec (countries, ports, shipping lines, freight rates, vehicle/container profiles, port charges, tax tables, exchange rates, blog, users).

## What needs your credentials to go fully live

The app **runs today** using the static sample datasets in `src/lib/data/` as a fallback — you don't need a database to develop or demo it. To connect a real, persistent database and auth:

1. **Create a Supabase project** at supabase.com and grab your project URL, anon key, and Postgres connection string.
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Run:
   ```bash
   npm install
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```
4. Update the API routes in `src/app/api/*` to query Prisma (`import { prisma } from "@/lib/prisma"`) instead of the static arrays in `src/lib/data/` — the shapes already match the Prisma schema, so this is a drop-in swap per route.

## Admin Panel

`/admin` is scaffolded with the full information architecture (Countries, Ports, Rates, Blog, Users, Statistics) but is **not yet auth-gated or wired to CRUD**. To finish it:
1. Add a session check at the top of `src/app/admin/page.tsx` using `createClient()` from `src/lib/supabase/server.ts`; redirect to a login page if there's no session or the user's `role` isn't `ADMIN`.
2. Build one server-actions file per entity (e.g. `src/app/admin/countries/actions.ts`) using Prisma create/update/delete, and simple forms/tables per section.

## Future Expansion (architecture already supports these)

The Prisma schema and calculator engines are structured so these can be added without a rewrite: live freight rates (swap the constants in `src/lib/calculations/` for `FreightRate` DB lookups), AI quotation assistant, freight forwarder/supplier directories, battery shipping calculator, Incoterms calculator, HS code search, currency converter (an `ExchangeRate` model already exists), container/AIS vessel tracking, quotation PDF export, CRM integration, and multi-language support (all UI strings are already isolated in component files for easy extraction to an i18n library like `next-intl`).

## Project Structure

```
src/
  app/                  # Next.js App Router pages & API routes
    (main)/             # Public-facing pages (calculators, databases, blog, etc.)
    api/                # REST endpoints
    admin/              # Admin dashboard scaffold
  components/
    ui/                 # shadcn-style primitives (Button, Card, Select, ...)
    layout/             # Navbar, Footer, theme provider/toggle
    calculators/         # The 4 calculator forms
    shared/              # Hero search, contact form
  lib/
    calculations/        # Freight, RoRo, container, export-cost engines
    data/                 # Sample datasets (countries, ports, lines, blog)
    supabase/             # Browser & server Supabase clients
  types/                  # Shared TypeScript domain types
prisma/
  schema.prisma           # Full normalized data model
  seed.ts                 # Seeds the sample data into Postgres
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import into Vercel, set the environment variables from `.env.example`.
3. Add a Vercel Postgres/Supabase build step or run `prisma migrate deploy` in a release step.

---

*All calculator outputs are indicative, non-binding estimates — see `/terms`.*
