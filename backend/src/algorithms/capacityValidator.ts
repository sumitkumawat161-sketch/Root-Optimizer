export interface CapacityCheckStop {
  id: string;
  demandKg: number;
}

export interface CapacityValidationResult {
  valid: boolean;
  totalDemandKg: number;
  capacityKg: number;
  overflowStopIds: string[];
}

export function validateVehicleCapacity(
  stops: CapacityCheckStop[],
  capacityKg: number
): CapacityValidationResult {
  let runningTotal = 0;
  const overflowStopIds: string[] = [];

  for (const stop of stops) {
    runningTotal += stop.demandKg;
    if (runningTotal > capacityKg) {
      overflowStopIds.push(stop.id);
    }
  }

  return {
    valid: overflowStopIds.length === 0,
    totalDemandKg: runningTotal,
    capacityKg,
    overflowStopIds
  };
}
