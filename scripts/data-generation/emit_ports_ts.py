import json

with open("/home/claude/scripts/ports_generated.json", encoding="utf-8") as f:
    rows = json.load(f)

def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

lines = []
lines.append('import { Port } from "@/types";')
lines.append("")
lines.append(f"// Generated dataset of {len(rows)} ports across major trade lanes worldwide.")
lines.append("//")
lines.append("// dataVerified: true  -> real, well-established UNLOCODE + city-level coordinates")
lines.append("//                       for globally significant ports (high confidence).")
lines.append("// dataVerified: false -> a representative port for a country/territory not")
lines.append("//                       otherwise covered; coordinates are city-level estimates")
lines.append("//                       and the UNLOCODE is generated in valid format but not")
lines.append("//                       checked against the official UN/LOCODE registry.")
lines.append("//")
lines.append("// Before production use, verify unverified entries against an authoritative")
lines.append("// source (UNECE UN/LOCODE registry, national port authority data, or a")
lines.append("// licensed port-data provider).")
lines.append("//")
lines.append("// nearbyAirports / nearbyWarehouses are intentionally left empty for the bulk")
lines.append("// of entries — populating them accurately at this scale needs a real data feed")
lines.append("// rather than hand-authored guesses; a handful of major hubs are filled in as")
lines.append("// examples.")
lines.append("export const ports: Port[] = [")

# A few illustrative examples for nearbyAirports/nearbyWarehouses on major hubs.
ENRICHED = {
    "cn-sha": (["Shanghai Pudong Intl (PVG)"], ["Waigaoqiao Free Trade Zone"]),
    "cn-ngb": (["Ningbo Lishe Intl (NGB)"], ["Beilun Logistics Park"]),
    "cn-szx": (["Shenzhen Bao'an Intl (SZX)"], ["Yantian Bonded Zone"]),
    "sg-sin": (["Singapore Changi (SIN)"], ["Jurong Port Free Trade Zone"]),
    "nl-rtm": (["Rotterdam The Hague (RTM)"], ["Maasvlakte Distribution Park"]),
    "us-lax": (["LAX"], ["Inland Empire DC Corridor"]),
    "ae-jea": (["Al Maktoum Intl (DWC)"], ["JAFZA Free Zone"]),
}

for r in rows:
    airports, warehouses = ENRICHED.get(r["id"], ([], []))
    a_str = ", ".join(f'"{esc(a)}"' for a in airports)
    w_str = ", ".join(f'"{esc(w)}"' for w in warehouses)
    lines.append("  {")
    lines.append(f'    id: "{r["id"]}",')
    lines.append(f'    name: "{esc(r["name"])}",')
    lines.append(f'    unlocode: "{r["unlocode"]}",')
    lines.append(f'    countryId: "{r["countryId"]}",')
    lines.append(f'    countryName: "{esc(r["countryName"])}",')
    lines.append(f'    latitude: {r["latitude"]},')
    lines.append(f'    longitude: {r["longitude"]},')
    lines.append(f'    nearbyAirports: [{a_str}],')
    lines.append(f'    nearbyWarehouses: [{w_str}],')
    lines.append(f'    roroAvailable: {"true" if r["roroAvailable"] else "false"},')
    lines.append(f'    containerAvailable: {"true" if r["containerAvailable"] else "false"},')
    lines.append(f'    dataVerified: {"true" if r["dataVerified"] else "false"},')
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("export function getPortById(id: string): Port | undefined {")
lines.append("  return ports.find((p) => p.id === id);")
lines.append("}")
lines.append("")
lines.append("export function getPortsByCountry(countryId: string): Port[] {")
lines.append("  return ports.filter((p) => p.countryId === countryId);")
lines.append("}")
lines.append("")
lines.append("export function getPortByUnlocode(unlocode: string): Port | undefined {")
lines.append('  return ports.find((p) => p.unlocode.toLowerCase() === unlocode.toLowerCase());')
lines.append("}")
lines.append("")

with open("/home/claude/global-freight-calculator/src/lib/data/ports.ts", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Wrote", len(rows), "ports to ports.ts")
