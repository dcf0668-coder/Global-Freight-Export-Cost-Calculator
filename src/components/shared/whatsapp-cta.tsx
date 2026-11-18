"use client";

import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CTA_LABEL, buildWhatsAppUrl } from "@/lib/site";

export type WhatsAppCtaVariant = "primary" | "outline" | "floating" | "banner";

// WhatsApp brand green with dark text keeps contrast >= 4.5:1 in both light
// and dark mode (the button always keeps its own background).
const FLOATING_CLASS =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-[#0b141a] shadow-lg transition-colors hover:bg-[#1fb959] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const VARIANT_CLASSES: Record<WhatsAppCtaVariant, string> = {
  primary: buttonVariants({ variant: "default" }),
  outline: buttonVariants({ variant: "outline" }),
  banner: buttonVariants({ variant: "default", size: "lg" }),
  floating: FLOATING_CLASS,
};

export function WhatsAppCta({
  source,
  variant = "primary",
  className,
}: {
  source: string;
  variant?: WhatsAppCtaVariant;
  className?: string;
}) {
  return (
    <a
      href={buildWhatsAppUrl(source)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Bulk Vehicle Procurement - chat on WhatsApp"
      data-cta-source={source}
      className={cn(VARIANT_CLASSES[variant], className)}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      <span className={variant === "floating" ? "hidden sm:inline" : undefined}>
        {CTA_LABEL}
      </span>
    </a>
  );
}
