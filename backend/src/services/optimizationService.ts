import {
  nearestNeighborRoute,
  nearestNeighborFromMatrix,
  haversineDistanceKm,
  GeoPoint
} from "../algorithms/nearestNeighbor";
import { calculateEtaMinutes } from "../algorithms/etaCalculator";
import { estimateFuelLiters } from "../algorithms/fuelEstimator";
import { priorityScheduleStops } from "../algorithms/priorityScheduler";
import { validateVehicleCapacity } from "../algorithms/capacityValidator";
import { getRoadRoute, getRoadDistanceMatrix, Coordinate } from "./osrmService";
import { AppError } from "../middleware/errorMiddleware";

export interface OptimizationStopInput {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  demandKg: number;
  priority: number;
}

export interface OptimizationInput {
  algorithm: "nearest-neighbor" | "priority-first";
  depot: GeoPoint;
  stops: OptimizationStopInput[];
  vehicleCapacityKg: number;
  fuelEfficiencyKmPerL: number;
  averageSpeedKmh: number;
  trafficFactor?: number;
}

export interface StopLeg {
  distanceFromPrevKm: number;
  durationFromPrevMin: number;
}

export interface OptimizationResult {
  orderedStops: OptimizationStopInput[];
  /** GeoJSON-style [lng, lat] path to render on the map. Real road path when
   *  OSRM is available, a straight-line fallback path otherwise. */
  geometry: [number, number][];
  totalDistanceKm: number;
  /** Pure travel time, excluding per-stop dwell time */
  totalTravelTimeMinutes: number;
  /** Travel time plus per-stop dwell overhead — used as the route's ETA */
  etaMinutes: number;
  estimatedFuelLiters: number;
  capacityCheck: ReturnType<typeof validateVehicleCapacity>;
  /** True when real OSRM road routing was used; false if the Haversine fallback ran */
  usedRoadRouting: boolean;
  /** One entry per stop, in order, describing the leg immediately preceding it */
  stopLegs: StopLeg[];
}

const STOP_DWELL_MINUTES = 5;

export async function optimizeRoute(input: OptimizationInput): Promise<OptimizationResult> {
  const capacityCheck = validateVehicleCapacity(
    input.stops.map((s) => ({ id: s.id, demandKg: s.demandKg })),
    input.vehicleCapacityKg
  );

  if (!capacityCheck.valid) {
    throw new AppError(
      `Total demand (${capacityCheck.totalDemandKg}kg) exceeds vehicle capacity (${input.vehicleCapacityKg}kg)`,
      422
    );
  }

  try {
    return await optimizeWithRoadDistance(input, capacityCheck);
  } catch (err) {
    console.warn(
      `[optimizationService] OSRM road routing unavailable, falling back to straight-line distance: ${
        (err as Error).message
      }`
    );
    return optimizeWithHaversineFallback(input, capacityCheck);
  }
}

async function optimizeWithRoadDistance(
  input: OptimizationInput,
  capacityCheck: ReturnType<typeof validateVehicleCapacity>
): Promise<OptimizationResult> {
  const orderedStops = await determineStopOrderByRoad(input);

  const routePoints: Coordinate[] = [input.depot, ...orderedStops];
  const road = await getRoadRoute(routePoints);

  const trafficFactor = input.trafficFactor ?? 1;
  const totalTravelTimeMinutes = Math.round(road.durationMinutes * trafficFactor);
  const etaMinutes = totalTravelTimeMinutes + orderedStops.length * STOP_DWELL_MINUTES;

  const totalLoad = orderedStops.reduce((sum, s) => sum + s.demandKg, 0);
  const estimatedFuelLiters = estimateFuelLiters({
    distanceKm: road.distanceKm,
    fuelEfficiencyKmPerL: input.fuelEfficiencyKmPerL,
    loadKg: totalLoad
  });

  return {
    orderedStops,
    geometry: road.geometry,
    totalDistanceKm: road.distanceKm,
    totalTravelTimeMinutes,
    etaMinutes,
    estimatedFuelLiters,
    capacityCheck,
    usedRoadRouting: true,
    stopLegs: road.legs.map((leg) => ({
      distanceFromPrevKm: leg.distanceKm,
      durationFromPrevMin: leg.durationMinutes
    }))
  };
}

async function determineStopOrderByRoad(
  input: OptimizationInput
): Promise<OptimizationStopInput[]> {
  if (input.algorithm === "priority-first") {
    const scheduled = priorityScheduleStops(
      input.stops.map((s) => ({ id: s.id, priority: s.priority, demandKg: s.demandKg }))
    );
    return scheduled.map((s) => input.stops.find((stop) => stop.id === s.id)!);
  }

  // nearest-neighbor, driven by a real road distance matrix instead of Haversine
  const allPoints: Coordinate[] = [
    input.depot,
    ...input.stops.map((s) => ({ latitude: s.latitude, longitude: s.longitude }))
  ];
  const { distanceMatrix } = await getRoadDistanceMatrix(allPoints);

  // depot is index 0 in allPoints/distanceMatrix; stops are indices 1..n
  const stopIndices = input.stops.map((_, idx) => idx + 1);
  const { order } = nearestNeighborFromMatrix(0, stopIndices, distanceMatrix);

  return order.map((matrixIdx) => input.stops[matrixIdx - 1]);
}

function optimizeWithHaversineFallback(
  input: OptimizationInput,
  capacityCheck: ReturnType<typeof validateVehicleCapacity>
): OptimizationResult {
  let orderedStops: OptimizationStopInput[];
  let totalDistanceKm: number;

  if (input.algorithm === "priority-first") {
    const scheduled = priorityScheduleStops(
      input.stops.map((s) => ({ id: s.id, priority: s.priority, demandKg: s.demandKg }))
    );
    orderedStops = scheduled.map((s) => input.stops.find((stop) => stop.id === s.id)!);
    totalDistanceKm = sumHaversineAlongOrder(input.depot, orderedStops);
  } else {
    const points: GeoPoint[] = input.stops.map((s) => ({
      id: s.id,
      latitude: s.latitude,
      longitude: s.longitude
    }));
    const result = nearestNeighborRoute(input.depot, points);
    orderedStops = result.orderedIds.map((id) => input.stops.find((s) => s.id === id)!);
    totalDistanceKm = result.totalDistanceKm;
  }

  const trafficFactor = input.trafficFactor ?? 1;

  const totalTravelTimeMinutes = calculateEtaMinutes({
    distanceKm: totalDistanceKm,
    averageSpeedKmh: input.averageSpeedKmh,
    trafficFactor,
    stopCount: 0
  });

  const etaMinutes = calculateEtaMinutes({
    distanceKm: totalDistanceKm,
    averageSpeedKmh: input.averageSpeedKmh,
    trafficFactor,
    stopCount: orderedStops.length,
    minutesPerStop: STOP_DWELL_MINUTES
  });

  const totalLoad = orderedStops.reduce((sum, s) => sum + s.demandKg, 0);
  const estimatedFuelLiters = estimateFuelLiters({
    distanceKm: totalDistanceKm,
    fuelEfficiencyKmPerL: input.fuelEfficiencyKmPerL,
    loadKg: totalLoad
  });

  const geometry: [number, number][] = [
    [input.depot.longitude, input.depot.latitude],
    ...orderedStops.map((s) => [s.longitude, s.latitude] as [number, number])
  ];

  const stopLegs: { distanceFromPrevKm: number; durationFromPrevMin: number }[] = [];
  let legFrom: GeoPoint = input.depot;
  for (const stop of orderedStops) {
    const point: GeoPoint = { id: stop.id, latitude: stop.latitude, longitude: stop.longitude };
    const legDistanceKm = haversineDistanceKm(legFrom, point);
    const legDurationMin = calculateEtaMinutes({
      distanceKm: legDistanceKm,
      averageSpeedKmh: input.averageSpeedKmh,
      trafficFactor,
      stopCount: 0
    });
    stopLegs.push({
      distanceFromPrevKm: parseFloat(legDistanceKm.toFixed(3)),
      durationFromPrevMin: legDurationMin
    });
    legFrom = point;
  }

  return {
    orderedStops,
    geometry,
    totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
    totalTravelTimeMinutes,
    etaMinutes,
    estimatedFuelLiters,
    capacityCheck,
    usedRoadRouting: false,
    stopLegs
  };
}

function sumHaversineAlongOrder(depot: GeoPoint, orderedStops: OptimizationStopInput[]): number {
  let dist = 0;
  let current: GeoPoint = depot;
  for (const stop of orderedStops) {
    const point: GeoPoint = { id: stop.id, latitude: stop.latitude, longitude: stop.longitude };
    dist += haversineDistanceKm(current, point);
    current = point;
  }
  return dist;
}
