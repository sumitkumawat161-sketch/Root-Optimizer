import prisma from "../config/prismaClient";
import { AppError } from "../middleware/errorMiddleware";
import { optimizeRoute, OptimizationStopInput } from "./optimizationService";
import { GeoPoint } from "../algorithms/nearestNeighbor";
import { getAvailableCapacityKg } from "./vehicleService";

export interface CreateRouteInput {
  name: string;
  vehicleId: string;
  driverId?: string;
  algorithm: "nearest-neighbor" | "priority-first";
  depot: GeoPoint;
  stops: Omit<OptimizationStopInput, "id">[];
  averageSpeedKmh: number;
  trafficFactor?: number;
}

/**
 * Consistent shape returned by every route-returning endpoint.
 *
 * Existing fields (`stops`, `totalDistanceKm`, `estimatedFuel`, `etaMinutes`)
 * are preserved as-is so nothing already depending on them breaks. The new
 * fields required by the road-routing upgrade are added alongside them:
 * `optimizedStops` (alias of `stops`), `geometry`, `totalDistance` (alias of
 * `totalDistanceKm`), `totalTravelTime`, and `eta` (an ISO timestamp).
 */
export interface RouteResponse {
  id: string;
  name: string;
  vehicleId: string | null;
  driverId: string | null;
  status: string;
  algorithm: string;
  totalDistanceKm: number;
  totalDistance: number;
  totalTravelTime: number | null;
  estimatedFuel: number;
  etaMinutes: number;
  eta: string | null;
  geometry: [number, number][] | null;
  stops: any[];
  optimizedStops: any[];
  vehicle: any;
  driver: any;
  createdAt: Date;
  updatedAt: Date;
}

function mapRouteToResponse(route: any): RouteResponse {
  const geometry = (route.geometry as [number, number][] | null) ?? null;

  // ETA = planned creation time + total estimated minutes (travel + stop dwell).
  // Once live progress tracking exists (driver panel, Module 7+), this can be
  // recomputed from remaining distance instead of the original plan.
  const eta =
    route.etaMinutes != null
      ? new Date(new Date(route.createdAt).getTime() + route.etaMinutes * 60000).toISOString()
      : null;

  return {
    id: route.id,
    name: route.name,
    vehicleId: route.vehicleId,
    driverId: route.driverId,
    status: route.status,
    algorithm: route.algorithm,
    totalDistanceKm: route.totalDistanceKm,
    totalDistance: route.totalDistanceKm,
    totalTravelTime: route.totalTravelTime ?? null,
    estimatedFuel: route.estimatedFuel,
    etaMinutes: route.etaMinutes,
    eta,
    geometry,
    stops: route.stops ?? [],
    optimizedStops: route.stops ?? [],
    vehicle: route.vehicle ?? null,
    driver: route.driver ?? null,
    createdAt: route.createdAt,
    updatedAt: route.updatedAt
  };
}

const routeInclude = {
  stops: { orderBy: { sequence: "asc" as const } },
  vehicle: true,
  driver: { include: { user: true } }
};

export async function createOptimizedRoute(input: CreateRouteInput): Promise<RouteResponse> {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: input.vehicleId } });
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  const stopsWithIds: OptimizationStopInput[] = input.stops.map((s, idx) => ({
    ...s,
    id: `temp-${idx}`
  }));

  const result = await optimizeRoute({
    algorithm: input.algorithm,
    depot: input.depot,
    stops: stopsWithIds,
    vehicleCapacityKg: getAvailableCapacityKg(vehicle),
    fuelEfficiencyKmPerL: vehicle.fuelEfficiency,
    averageSpeedKmh: input.averageSpeedKmh,
    trafficFactor: input.trafficFactor
  });

  const route = await prisma.route.create({
    data: {
      name: input.name,
      vehicleId: input.vehicleId,
      driverId: input.driverId,
      algorithm: input.algorithm,
      totalDistanceKm: result.totalDistanceKm,
      totalTravelTime: result.totalTravelTimeMinutes,
      geometry: result.geometry as any,
      estimatedFuel: result.estimatedFuelLiters,
      etaMinutes: result.etaMinutes,
      status: "PLANNED",
      stops: {
        create: result.orderedStops.map((stop, index) => ({
          sequence: index + 1,
          label: stop.label,
          latitude: stop.latitude,
          longitude: stop.longitude,
          demandKg: stop.demandKg,
          priority: stop.priority,
          distanceFromPrevKm: result.stopLegs[index]?.distanceFromPrevKm ?? 0,
          durationFromPrevMin: result.stopLegs[index]?.durationFromPrevMin ?? 0
        }))
      }
    },
    include: routeInclude
  });

  const totalLoadKg = result.orderedStops.reduce((sum, s) => sum + s.demandKg, 0);

  await prisma.vehicle.update({
    where: { id: input.vehicleId },
    data: { status: "ON_ROUTE", currentLoad: { increment: totalLoadKg } }
  });

  return mapRouteToResponse(route);
}

export async function listRoutes(): Promise<RouteResponse[]> {
  const routes = await prisma.route.findMany({
    include: routeInclude,
    orderBy: { createdAt: "desc" }
  });
  return routes.map(mapRouteToResponse);
}

export async function getRouteById(id: string): Promise<RouteResponse> {
  const route = await prisma.route.findUnique({
    where: { id },
    include: routeInclude
  });
  if (!route) {
    throw new AppError("Route not found", 404);
  }
  return mapRouteToResponse(route);
}

export async function updateRouteStatus(
  id: string,
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
): Promise<RouteResponse> {
  const existing = await prisma.route.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Route not found", 404);
  }

  const updated = await prisma.route.update({
    where: { id },
    data: { status },
    include: routeInclude
  });

  if (status === "COMPLETED" || status === "CANCELLED") {
    if (existing.vehicleId) {
      const routeLoadKg = updated.stops.reduce(
        (sum: number, s: { demandKg: number }) => sum + s.demandKg,
        0
      );
      await prisma.vehicle.update({
        where: { id: existing.vehicleId },
        data: { status: "AVAILABLE", currentLoad: { decrement: routeLoadKg } }
      });
    }
  }

  return mapRouteToResponse(updated);
}

export async function markStopVisited(routeId: string, stopId: string) {
  const route = await prisma.route.findUnique({ where: { id: routeId } });
  if (!route) {
    throw new AppError("Route not found", 404);
  }
  return prisma.stop.update({
    where: { id: stopId },
    data: { visited: true }
  });
}

export async function deleteRoute(id: string) {
  const route = await prisma.route.findUnique({ where: { id } });
  if (!route) {
    throw new AppError("Route not found", 404);
  }
  await prisma.route.delete({ where: { id } });
}
