import { ContainerCalculatorInput, ContainerCalculatorResult, ContainerSuggestion, ContainerSize } from "@/types";
import { round } from "@/lib/utils";

// Usable internal capacity (accounting for realistic packing loss, not the
// theoretical steel-box max) for each standard container size.
const CONTAINER_USABLE_CBM: Record<ContainerSize, number> = {
  "20GP": 28,
  "40GP": 58,
  "40HQ": 68,
  "45HQ": 78,
};

const CONTAINER_MAX_PAYLOAD_KG: Record<ContainerSize, number> = {
  "20GP": 25000,
  "40GP": 27000,
  "40HQ": 28500,
  "45HQ": 29000,
};

// Real-world loading efficiency rarely hits 100% due to carton shape, pallet
// use, and bracing/void space requirements.
const PALLETIZED_EFFICIENCY = 0.82;
const FLOOR_LOADED_EFFICIENCY = 0.92;

export function calculateContainerLoad(input: ContainerCalculatorInput): ContainerCalculatorResult {
  const cartonCbm = (input.cartonLengthCm / 100) * (input.cartonWidthCm / 100) * (input.cartonHeightCm / 100);
  const rawTotalCbm = cartonCbm * input.numberOfCartons;
  const totalWeightKg = input.cartonWeightKg * input.numberOfCartons;

  const efficiency = input.usePallets ? PALLETIZED_EFFICIENCY : FLOOR_LOADED_EFFICIENCY;
  const effectiveCbm = rawTotalCbm / efficiency;

  const suggestions: ContainerSuggestion[] = (Object.keys(CONTAINER_USABLE_CBM) as ContainerSize[]).map((size) => {
    const usable = CONTAINER_USABLE_CBM[size];
    const maxPayload = CONTAINER_MAX_PAYLOAD_KG[size];
    const cartonsPerContainer = Math.floor((usable * efficiency) / cartonCbm);
    const containersByVolume = Math.ceil(effectiveCbm / usable);
    const containersByWeight = Math.ceil(totalWeightKg / maxPayload);
    const containersNeeded = Math.max(containersByVolume, containersByWeight, 1);
    const utilizationPercent = round(
      (effectiveCbm / (containersNeeded * usable)) * 100,
      1
    );

    return {
      size,
      utilizationPercent: Math.min(utilizationPercent, 100),
      cartonsPerContainer: Math.max(cartonsPerContainer, 0),
      containersNeeded,
    };
  });

  return {
    totalCbm: round(rawTotalCbm, 3),
    totalWeightKg: round(totalWeightKg, 1),
    loadingEfficiencyPercent: round(efficiency * 100, 1),
    suggestions,
  };
}
