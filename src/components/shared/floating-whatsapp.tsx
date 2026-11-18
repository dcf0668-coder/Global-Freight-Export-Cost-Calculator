"use client";

import { usePathname } from "next/navigation";
import { WhatsAppCta } from "@/components/shared/whatsapp-cta";

/**
 * Site-wide floating WhatsApp button. Hidden on /admin and in print output.
 * z-40 keeps it below Radix overlays (z-50).
 */
export function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">
      <WhatsAppCta source="floating" variant="floating" />
    </div>
  );
}
