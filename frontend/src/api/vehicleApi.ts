import axiosClient from "./axiosClient";
import { Vehicle } from "../types";

export interface VehiclePayload {
  plateNumber: string;
  type: string;
  capacityKg: number;
  fuelEfficiency: number;
  maxWeight?: number;
  maxVolume?: number;
  currentLoad?: number;
  status?: string;
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  const { data } = await axiosClient.get<Vehicle[]>("/api/vehicles");
  return data;
}

export async function fetchVehicle(id: string): Promise<Vehicle> {
  const { data } = await axiosClient.get<Vehicle>(`/api/vehicles/${id}`);
  return data;
}

export async function createVehicleRequest(payload: VehiclePayload): Promise<Vehicle> {
  const { data } = await axiosClient.post<Vehicle>("/api/vehicles", payload);
  return data;
}

export async function updateVehicleRequest(
  id: string,
  payload: Partial<VehiclePayload>
): Promise<Vehicle> {
  const { data } = await axiosClient.put<Vehicle>(
    `/api/vehicles/${id}`,
    payload
  );
  return data;
}

export async function deleteVehicleRequest(id: string): Promise<void> {
  await axiosClient.delete(`/api/vehicles/${id}`);
}