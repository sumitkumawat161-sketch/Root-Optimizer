import axiosClient from "./axiosClient";
import {
  DashboardSummary,
  StatusBreakdownItem,
  VehicleUtilizationItem,
} from "../types";

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await axiosClient.get<DashboardSummary>(
    "/api/analytics/dashboard"
  );
  return data;
}

export async function fetchFuelReport() {
  const { data } = await axiosClient.get(
    "/api/analytics/fuel-report"
  );
  return data;
}

export async function fetchStatusBreakdown(): Promise<StatusBreakdownItem[]> {
  const { data } = await axiosClient.get<StatusBreakdownItem[]>(
    "/api/analytics/status-breakdown"
  );
  return data;
}

export async function fetchVehicleUtilization(): Promise<VehicleUtilizationItem[]> {
  const { data } = await axiosClient.get<VehicleUtilizationItem[]>(
    "/api/analytics/vehicle-utilization"
  );
  return data;
}