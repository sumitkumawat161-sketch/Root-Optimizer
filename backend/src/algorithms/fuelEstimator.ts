export interface FuelEstimateOptions {
  distanceKm: number;
  fuelEfficiencyKmPerL: number;
  loadKg?: number;
  loadPenaltyFactor?: number;
}

export function estimateFuelLiters(options: FuelEstimateOptions): number {
  const {
    distanceKm,
    fuelEfficiencyKmPerL,
    loadKg = 0,
    loadPenaltyFactor = 0.00005
  } = options;

  const safeEfficiency = Math.max(fuelEfficiencyKmPerL, 0.1);
  const baseLiters = distanceKm / safeEfficiency;
  const loadPenalty = baseLiters * loadKg * loadPenaltyFactor;

  return parseFloat((baseLiters + loadPenalty).toFixed(2));
}
