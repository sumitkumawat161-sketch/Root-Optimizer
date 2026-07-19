import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchRoutes,
  fetchRoute,
  createRouteRequest,
  updateRouteStatusRequest,
  markStopVisitedRequest,
  deleteRouteRequest,
  CreateRoutePayload
} from "../api/routeApi";

export function useRoutes() {
  return useQuery("routes", fetchRoutes);
}

export function useRoute(id: string) {
  return useQuery(["route", id], () => fetchRoute(id), { enabled: !!id });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation((payload: CreateRoutePayload) => createRouteRequest(payload), {
    onSuccess: () => queryClient.invalidateQueries("routes")
  });
}

export function useUpdateRouteStatus() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, status }: { id: string; status: string }) => updateRouteStatusRequest(id, status),
    { onSuccess: () => queryClient.invalidateQueries("routes") }
  );
}

export function useMarkStopVisited() {
  const queryClient = useQueryClient();
  return useMutation(
    ({ routeId, stopId }: { routeId: string; stopId: string }) =>
      markStopVisitedRequest(routeId, stopId),
    { onSuccess: () => queryClient.invalidateQueries("routes") }
  );
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteRouteRequest(id), {
    onSuccess: () => queryClient.invalidateQueries("routes")
  });
}
