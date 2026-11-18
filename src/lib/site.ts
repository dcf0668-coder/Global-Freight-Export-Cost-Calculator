// ---------------------------------------------------------------------------
// Site-wide constants. Keep the canonical domain, brand name, WhatsApp config
// and other cross-cutting values in a single place so they can be changed
// without touching every page/layout.
// ---------------------------------------------------------------------------

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lang-mao.com"
).replace(/\/$/, "");

export const SITE_NAME = "Global Freight Calculator";

/**
 * ISO date the static pages were last meaningfully updated. Bump manually
 * whenever the content of the static routes changes.
 */
export const SITE_LAST_UPDATED = "2026-11-18";

/** WhatsApp number in digits only (wa.me requires no "+", spaces or dashes). */
export const WHATSAPP_NUMBER = "8619589480967";

export const CTA_LABEL = "Bulk Vehicle Procurement";

/** Build a wa.me link with a pre-filled message that includes the source page. */
export function buildWhatsAppUrl(source: string): string {
  const text = `Hello, I'm interested in Bulk Vehicle Procurement. (Source: ${source})`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Round a count down to the nearest ten and append "+" (e.g. 243 -> "240+"). */
export function approximateCount(n: number): string {
  return `${Math.floor(n / 10) * 10}+`;
}
