"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Country } from "@/types";

interface CountryComboboxProps {
  countries: Country[];
  value: string;
  onChange: (countryId: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A searchable country picker. Unlike a native/Radix <select>, this filters
 * the list as you type (not just jump-to-first-match type-ahead), which is
 * what actually makes "type first letters -> find the country" work
 * reliably across 240+ entries. `countries` is expected to already be
 * sorted the way it should display when the search box is empty.
 */
export function CountryCombobox({ countries, value, onChange, placeholder = "Select a country...", className }: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const selected = React.useMemo(() => countries.find((c) => c.id === value), [countries, value]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    // Prioritize matches where the country name STARTS with the query
    // (e.g. typing "ca" should surface Canada before Madagascar), falling
    // back to substring matches.
    const startsWith = countries.filter((c) => c.name.toLowerCase().startsWith(q));
    const contains = countries.filter((c) => !c.name.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q));
    return [...startsWith, ...contains];
  }, [countries, query]);

  React.useEffect(() => setHighlightedIndex(0), [query, open]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  function selectCountry(country: Country) {
    onChange(country.id);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightedIndex]) selectCountry(filtered[highlightedIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className={cn(!selected && "text-muted-foreground")}>{selected ? selected.name : placeholder}</span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul ref={listRef} className="max-h-72 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">No countries match "{query}".</li>
            )}
            {filtered.map((country, i) => (
              <li key={country.id}>
                <button
                  type="button"
                  onClick={() => selectCountry(country)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                    i === highlightedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent"
                  )}
                >
                  <span>{country.name}</span>
                  {country.id === value && <Check className="h-4 w-4 text-primary" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}