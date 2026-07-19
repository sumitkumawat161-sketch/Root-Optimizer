import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchVehicles,
  createVehicleRequest,
  updateVehicleRequest,
  deleteVehicleRequest,
  VehiclePayload
} from "../api/vehicleApi";

export function useVehicles() {
  return useQuery("vehicles", fetchVehicles);
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation((payload: VehiclePayload) => createVehicleRequest(payload), {
    onSuccess: () => queryClient.invalidateQueries("vehicles")
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, payload }: { id: string; payload: Partial<VehiclePayload> }) =>
      updateVehicleRequest(id, payload),
    { onSuccess: () => queryClient.invalidateQueries("vehicles") }
  );
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteVehicleRequest(id), {
    onSuccess: () => queryClient.invalidateQueries("vehicles")
  });
}
