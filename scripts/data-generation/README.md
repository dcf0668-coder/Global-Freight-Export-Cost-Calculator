# Data Generation Scripts

These scripts generated `src/lib/data/countries.ts` and `src/lib/data/ports.ts`.
They're kept here so the datasets can be regenerated or extended later
(e.g. adding more ports, correcting a coordinate, verifying a tariff rate)
without hand-editing 4000+ lines of generated TypeScript directly.

## Regenerating countries.ts

```bash
python3 gen_countries.py          # -> countries_generated.json
python3 emit_countries_ts.py      # -> ../../src/lib/data/countries.ts
```

To fix or add a country: edit the `DATA` list (and `VERIFIED_OVERRIDES` for
confirmed tariff rates) in `gen_countries.py`, then re-run both scripts.

## Regenerating ports.ts

```bash
python3 gen_ports.py              # -> ports_generated.json (also prints counts/validation)
python3 emit_ports_ts.py          # -> ../../src/lib/data/ports.ts
```

Ports are organized in tiers by confidence:
- `TIER1` / `TIER1_EXTRA` / `TIER3` / `TIER4`: real, well-established ports
  (`dataVerified: true`).
- `TIER2`: one representative port per remaining coastal country/territory,
  with estimated coordinates and a generated (unverified) UNLOCODE
  (`dataVerified: false`).

To add a port, append a tuple to the relevant tier:
`(iso2, port_name, unlocode, lat, lon, roro_available, container_available, verified)`
then re-run both scripts. The assembly step at the bottom of `gen_ports.py`
deduplicates by UNLOCODE and validates format automatically.

## Data confidence

Neither script calls any external API — all facts come from static reference
knowledge. Before using this data for real routing, customs, or compliance
decisions, verify anything marked `dataVerified: false` / `tariffVerified: false`
against an authoritative source (UNECE UN/LOCODE registry, national customs
authorities, WTO Tariff Database, or a licensed data provider).
