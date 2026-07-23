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
- **Live-rate DB integration** (Phase C): `/api/calculate` tries a real database lookup first — see `src/lib/db/rates.ts` and the "Live rate calculation" section below — and only falls back to the static estimator when no matching rate exists. Every result is tagged `rateSource: "live" | "estimated"` so the UI can show which one you got (look for the "Live Rate" / "Estimated" badge on the Freight and RoRo calculators).
- Country / Port / Shipping Line / Blog browse pages, populated with 243 countries and 501 ports (see Phase A/B notes below).
- REST API: `/api/calculate`, `/api/countries`, `/api/ports`, `/api/shipping-lines`, `/api/blog`, `/api/search`.
- Dark/light mode, responsive layout, SEO (metadata, `robots.ts`, `sitemap.ts`, JSON-LD on blog posts, canonical URLs).
- Full Prisma schema modeling every entity in the spec (countries, ports, shipping lines, freight rates, shipping routes, port capabilities, vehicle models, port charges, tax tables, exchange rates, blog, users).

## Live rate calculation (Phase C)

`/api/calculate` (freight and RoRo modes) now works like this:

1. Try to find a real `FreightRate` row in the database for the exact origin port + destination port + cargo type (+ container size for FCL). If found, use its rate and transit time, and — for the main freight calculator — also check for a real `PortCharge` row (real customs clearance fee) and a real `ExchangeRate` row (adds a `convertedEstimate` in the destination's local currency).
2. If no `DATABASE_URL` is configured, the DB is unreachable, or no rate has been entered for that specific lane yet, it falls back to the static per-unit-cost estimator in `src/lib/calculations/freight.ts` / `roro.ts` — the API never errors out just because the database isn't set up.
3. The response always includes `rateSource: "live" | "estimated"` so callers (and the UI) know which path was used.

The seed script (`prisma/seed.ts`) includes ~19 real China-origin lanes (Shanghai/Ningbo/Shenzhen/Guangzhou → Rotterdam, Hamburg, Los Angeles, Jebel Ali, Lagos, Durban, Melbourne, Santos, Singapore, Mumbai) plus port charges for 12 major ports, exchange rates for 15 currencies, and a 20-model vehicle catalog — enough to see the "Live Rate" badge working end-to-end once you connect a database and run `npm run db:seed`. Everything else falls back to `"estimated"`, which is expected — the seed data is a demonstration sample, not a full rate card.

**Important id detail**: `prisma/seed.ts` seeds `Country`, `Port`, and `ShippingLine` rows using the *same ids* as the static frontend datasets in `src/lib/data/*.ts` (e.g. Country `"cn"`, Port `"cn-sha"`) instead of Prisma's default random cuids. This is required — the frontend's dropdowns send those static ids to the API, so the DB rows have to use them too for the live lookups to ever match. If you add new countries/ports directly in the DB (e.g. via the admin panel) instead of through the seed script, make sure the frontend has a matching entry (or switch the frontend to fetch from `/api/countries` / `/api/ports` instead of the static files) — otherwise those new rows just won't be reachable from the UI.

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
4. The `/api/calculate` route is already wired to Prisma (see "Live rate calculation" above) — no further code changes needed for that endpoint. `/api/countries`, `/api/ports`, `/api/shipping-lines`, `/api/blog` still read from the static files in `src/lib/data/`; swapping those to Prisma queries is a similar drop-in change (the shapes already match the schema) if you want the browse pages backed by the DB too.

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
