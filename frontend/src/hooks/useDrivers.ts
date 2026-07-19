import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchDrivers,
  createDriverRequest,
  updateDriverRequest,
  deleteDriverRequest,
  DriverPayload
} from "../api/driverApi";

export function useDrivers() {
  return useQuery("drivers", fetchDrivers);
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  return useMutation((payload: DriverPayload) => createDriverRequest(payload), {
    onSuccess: () => queryClient.invalidateQueries("drivers")
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, payload }: { id: string; payload: Partial<DriverPayload> & { available?: boolean } }) =>
      updateDriverRequest(id, payload),
    { onSuccess: () => queryClient.invalidateQueries("drivers") }
  );
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteDriverRequest(id), {
    onSuccess: () => queryClient.invalidateQueries("drivers")
  });
}
