import json

with open("/home/claude/scripts/countries_generated.json", encoding="utf-8") as f:
    rows = json.load(f)

def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

lines = []
lines.append('import { Country } from "@/types";')
lines.append("")
lines.append("// Generated dataset covering all UN member states plus major populated")
lines.append("// overseas territories relevant to international trade (243 entries).")
lines.append("//")
lines.append("// IMPORTANT: importDutyRate / vatRate are REGIONAL-AVERAGE PLACEHOLDERS")
lines.append("// (tariffVerified: false), not authoritative per-country tariff data.")
lines.append("// Before using this in production, replace these with figures from an")
lines.append("// authoritative source (e.g. the WTO Tariff Database, national customs")
lines.append("// authorities, or a licensed trade-compliance data provider) and flip")
lines.append("// tariffVerified to true as each country is confirmed.")
lines.append("//")
lines.append("// popularPorts is populated by the port database seed (see ports.ts /")
lines.append("// prisma/seed.ts) and intentionally left empty here to avoid duplication.")
lines.append("export const countries: Country[] = [")

for r in rows:
    docs = ", ".join(f'"{esc(d)}"' for d in r["requiredDocuments"])
    lines.append("  {")
    lines.append(f'    id: "{r["isoCode"].lower()}",')
    lines.append(f'    name: "{esc(r["name"])}",')
    lines.append(f'    isoCode: "{r["isoCode"]}",')
    lines.append(f'    region: "{esc(r["region"])}",')
    lines.append(f'    subregion: "{esc(r["subregion"])}",')
    lines.append(f'    currency: "{r["currency"]}",')
    lines.append(f'    voltage: "{r["voltage"]}",')
    lines.append(f'    drivingSide: "{r["drivingSide"]}",')
    lines.append(f'    importDutyRate: {r["importDutyRate"]},')
    lines.append(f'    vatRate: {r["vatRate"]},')
    lines.append(f'    tariffVerified: {"true" if r["tariffVerified"] else "false"},')
    lines.append(f'    requiresInspection: {"true" if r["requiresInspection"] else "false"},')
    lines.append(f'    requiredDocuments: [{docs}],')
    lines.append("    popularPorts: [],")
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("export function getCountryById(id: string): Country | undefined {")
lines.append("  return countries.find((c) => c.id === id);")
lines.append("}")
lines.append("")
lines.append("export function getCountryByIso(isoCode: string): Country | undefined {")
lines.append("  return countries.find((c) => c.isoCode.toLowerCase() === isoCode.toLowerCase());")
lines.append("}")
lines.append("")
lines.append("export function getCountriesByRegion(region: string): Country[] {")
lines.append("  return countries.filter((c) => c.region.toLowerCase() === region.toLowerCase());")
lines.append("}")
lines.append("")

with open("/home/claude/global-freight-calculator/src/lib/data/countries.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Wrote", len(rows), "countries to countries.ts")
