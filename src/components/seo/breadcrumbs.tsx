import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbListJsonLd, type BreadcrumbItem } from "./json-ld";

/**
 * Visible breadcrumb navigation (with aria-current + aria-label) plus the
 * matching BreadcrumbList JSON-LD. Render at the top of every inner page.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <BreadcrumbListJsonLd items={items} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.path}-${item.name}`} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />
                )}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path as never}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
