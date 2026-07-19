import { env } from "../config/env";
import { AppError } from "../middleware/errorMiddleware";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteLeg {
  distanceKm: number;
  durationMinutes: number;
}

export interface RoadRouteResult {
  /** GeoJSON LineString coordinates as [lng, lat] pairs, in travel order */
  geometry: [number, number][];
  distanceKm: number;
  durationMinutes: number;
  /** One entry per leg between consecutive waypoints (depot->stop1, stop1->stop2, ...) */
  legs: RouteLeg[];
}

export interface DistanceMatrixResult {
  /** distanceMatrix[i][j] = road distance in km from point i to point j */
  distanceMatrix: number[][];
  /** durationMatrix[i][j] = travel time in minutes from point i to point j */
  durationMatrix: number[][];
}

function toOsrmCoordString(points: Coordinate[]): string {
  return points.map((p) => `${p.longitude},${p.latitude}`).join(";");
}

/**
 * Calls the self-hosted OSRM /route service to get the real road geometry,
 * distance and duration for an ordered sequence of stops.
 */
export async function getRoadRoute(points: Coordinate[]): Promise<RoadRouteResult> {
  if (points.length < 2) {
    throw new AppError("At least two points are required to compute a road route", 400);
  }

  const coordString = toOsrmCoordString(points);
  const url = `${env.osrmUrl}/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new AppError("Unable to reach the OSRM routing service", 502);
  }

  if (!response.ok) {
    throw new AppError("OSRM routing service returned an error", 502);
  }

  const data: any = await response.json();

  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new AppError("OSRM could not compute a road route for these coordinates", 422);
  }

  const route = data.routes[0];

  const legs: RouteLeg[] = (route.legs || []).map((leg: any) => ({
    distanceKm: parseFloat((leg.distance / 1000).toFixed(3)),
    durationMinutes: parseFloat((leg.duration / 60).toFixed(2))
  }));

  return {
    geometry: route.geometry.coordinates as [number, number][],
    distanceKm: parseFloat((route.distance / 1000).toFixed(2)),
    durationMinutes: Math.round(route.duration / 60),
    legs
  };
}

/**
 * Calls the self-hosted OSRM /table service to get a full pairwise road
 * distance/duration matrix between all given points. Used by the
 * optimization algorithms instead of straight-line (Haversine) distance.
 */
export async function getRoadDistanceMatrix(points: Coordinate[]): Promise<DistanceMatrixResult> {
  if (points.length < 2) {
    throw new AppError("At least two points are required to compute a distance matrix", 400);
  }

  const coordString = toOsrmCoordString(points);
  const url = `${env.osrmUrl}/table/v1/driving/${coordString}?annotations=distance,duration`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new AppError("Unable to reach the OSRM routing service", 502);
  }

  if (!response.ok) {
    throw new AppError("OSRM routing service returned an error", 502);
  }

  const data: any = await response.json();

  if (data.code !== "Ok" || !data.distances || !data.durations) {
    throw new AppError("OSRM could not compute a distance matrix for these coordinates", 422);
  }

  const distanceMatrix: number[][] = data.distances.map((row: number[]) =>
    row.map((meters) => parseFloat((meters / 1000).toFixed(3)))
  );
  const durationMatrix: number[][] = data.durations.map((row: number[]) =>
    row.map((seconds) => parseFloat((seconds / 60).toFixed(2)))
  );

  return { distanceMatrix, durationMatrix };
}
