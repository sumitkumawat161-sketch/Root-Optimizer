export type Role = "ADMIN" | "DISPATCHER" | "DRIVER";
export type VehicleStatus = "AVAILABLE" | "ON_ROUTE" | "MAINTENANCE";
export type RouteStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  capacityKg: number;
  fuelEfficiency: number;
  maxWeight: number | null;
  maxVolume: number | null;
  currentLoad: number;
  status: VehicleStatus;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  phone: string;
  licenseNo: string;
  vehicleId: string | null;
  available: boolean;
  user?: User;
  vehicle?: Vehicle | null;
  routes?: RouteRecord[];
}

export interface Stop {
  id: string;
  routeId: string;
  sequence: number;
  label: string;
  latitude: number;
  longitude: number;
  demandKg: number;
  priority: number;
  visited: boolean;
  distanceFromPrevKm: number;
  durationFromPrevMin: number;
}

export interface RouteRecord {
  id: string;
  name: string;
  vehicleId: string | null;
  driverId: string | null;
  status: RouteStatus;
  algorithm: string;
  totalDistanceKm: number;
  totalDistance: number;
  totalTravelTime: number | null;
  estimatedFuel: number;
  etaMinutes: number;
  eta: string | null;
  /** [lng, lat] road path from OSRM (or straight-line fallback) */
  geometry: [number, number][] | null;
  createdAt: string;
  stops: Stop[];
  optimizedStops: Stop[];
  vehicle?: Vehicle | null;
  driver?: Driver | null;
}

export interface DashboardSummary {
  totalRoutes: number;
  activeRoutes: number;
  totalVehicles: number;
  availableVehicles: number;
  totalDrivers: number;
  totalFuelLiters: number;
  totalDistanceKm: number;
  totalTravelTimeMinutes: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  nextEta: string | null;
}

export interface StatusBreakdownItem {
  status: RouteStatus;
  count: number;
}

export interface VehicleUtilizationItem {
  plateNumber: string;
  status: VehicleStatus;
  totalRoutes: number;
}

export interface CsvStopRow {
  label: string;
  latitude: number;
  longitude: number;
  demandKg: number;
  priority: number;
}
