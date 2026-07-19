import prisma from "../config/prismaClient";
import { AppError } from "../middleware/errorMiddleware";

export interface VehicleInput {
  plateNumber: string;
  type: string;
  capacityKg: number;
  fuelEfficiency: number;
  maxWeight?: number;
  maxVolume?: number;
  currentLoad?: number;
  status?: "AVAILABLE" | "ON_ROUTE" | "MAINTENANCE";
  latitude?: number;
  longitude?: number;
}

export async function createVehicle(input: VehicleInput) {
  const existing = await prisma.vehicle.findUnique({
    where: { plateNumber: input.plateNumber }
  });
  if (existing) {
    throw new AppError("Vehicle with this plate number already exists", 409);
  }

  return prisma.vehicle.create({ data: input });
}

export async function listVehicles() {
  return prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getVehicleById(id: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }
  return vehicle;
}

export async function updateVehicle(id: string, input: Partial<VehicleInput>) {
  await getVehicleById(id);
  return prisma.vehicle.update({ where: { id }, data: input });
}

export async function deleteVehicle(id: string) {
  await getVehicleById(id);
  await prisma.vehicle.delete({ where: { id } });
}

export async function updateVehicleLocation(id: string, latitude: number, longitude: number) {
  await getVehicleById(id);
  return prisma.vehicle.update({
    where: { id },
    data: { latitude, longitude }
  });
}

/** Effective weight capacity remaining for new deliveries, factoring in current load */
export function getAvailableCapacityKg(vehicle: {
  maxWeight: number | null;
  capacityKg: number;
  currentLoad: number;
}): number {
  const limit = vehicle.maxWeight ?? vehicle.capacityKg;
  return Math.max(limit - vehicle.currentLoad, 0);
}
