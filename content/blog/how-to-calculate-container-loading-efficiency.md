---
title: "How to Calculate Container Loading Efficiency"
excerpt: "Maximize container utilization and cut your per-unit shipping cost with these CBM planning techniques — plus the packing realities that keep you from ever hitting 100%."
category: SHIPPING
publishedAt: "2026-03-15"
author: "Global Freight Calculator Team"
---

Container freight is priced per container, not per carton — so the percentage of that container you actually fill directly determines your cost per unit shipped. A shipment loaded at 65% utilization is paying for 35% of empty space. Here's how to plan around that.

## Start with usable capacity, not rated capacity

Standard container specs (e.g. "33.2 CBM" for a 20ft container) describe the theoretical internal volume of an empty steel box. You will never actually load cargo to that number. Realistic usable capacity depends on:

- **Carton shape.** Rectangular cartons that share dimensions with the container's internal width stack far more efficiently than irregular shapes or a mix of different carton sizes.
- **Palletization.** Pallets add stability and speed up loading/unloading, but the pallet itself consumes space and creates gaps between pallet edges and the container wall — floor-loading (stacking cartons directly, no pallets) typically achieves noticeably higher volumetric efficiency, at the cost of slower manual loading and higher labor cost.
- **Bracing and void space requirements.** Cargo needs to be secured against shifting during transit; that means some deliberate void space and bracing material is unavoidable, not a planning failure.

A realistic planning target is **80-90% utilization**, not 100%.

## The calculation

1. **Get your carton's CBM**: `(length × width × height) ÷ 1,000,000` if measuring in centimeters, giving you cubic meters.
2. **Multiply by carton count** to get total shipment CBM.
3. **Divide by the container's usable capacity** (not rated capacity) to estimate how many containers you need.
4. **Cross-check against weight.** Containers have a maximum payload weight as well as a volume limit — dense cargo (metal parts, liquids, machinery) often hits the *weight* limit long before the *volume* limit, meaning you'll need more containers than the CBM math alone suggests, each partially empty by volume but full by weight.

## Common efficiency mistakes

**Mixing carton sizes without a loading plan.** Multiple SKUs with different carton dimensions create irregular gaps unless you deliberately plan the stacking pattern (e.g. grouping same-size cartons together, using smaller cartons to fill gaps left by larger ones).

**Treating "20ft vs 40ft" as purely a volume decision.** A 40ft container isn't simply "double" a 20ft container's practical capacity — it also has different weight limits and different per-CBM shipping economics. For dense cargo especially, two 20ft containers sometimes work out cheaper *and* more weight-efficient than one 40ft.

**Not accounting for pallet footprint loss.** A standard pallet's footprint doesn't tile perfectly into a container's internal width — depending on the pallet standard used (e.g. 1200×1000mm vs 1165×1165mm), you can lose a meaningful strip of unusable space along the container wall on every row.

## Practical planning workflow

1. Enter your carton dimensions, weight, and quantity into the [Container Calculator](/container-calculator).
2. Compare the suggested container sizes side by side — the tool shows utilization percentage and container count for 20GP, 40GP, 40HQ, and 45HQ so you can see where the efficiency curve breaks in your favor.
3. If utilization comes back under ~70%, consider whether a different container size, a different pallet configuration, or consolidating with an LCL shipment instead would work out cheaper — see our guide on [FCL vs LCL](/blog/fcl-vs-lcl-which-to-choose) for that comparison.
