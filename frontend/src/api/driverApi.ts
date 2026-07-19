import axiosClient from "./axiosClient";
import { Driver } from "../types";

export interface DriverPayload {
  email: string;
  phone: string;
  licenseNo: string;
  vehicleId?: string;
}

export async function fetchDrivers(): Promise<Driver[]> {
  const { data } = await axiosClient.get<Driver[]>("/api/drivers");
  return data;
}

export async function fetchMyDriverProfile(): Promise<Driver> {
  const { data } = await axiosClient.get<Driver>("/api/drivers/me");
  return data;
}

export async function createDriverRequest(payload: DriverPayload): Promise<Driver> {
  const { data } = await axiosClient.post<Driver>("/api/drivers", payload);
  return data;
}

export async function updateDriverRequest(
  id: string,
  payload: Partial<DriverPayload> & { available?: boolean }
): Promise<Driver> {
  const { data } = await axiosClient.put<Driver>(`/api/drivers/${id}`, payload);
  return data;
}

export async function deleteDriverRequest(id: string): Promise<void> {
  await axiosClient.delete(`/api/drivers/${id}`);
}