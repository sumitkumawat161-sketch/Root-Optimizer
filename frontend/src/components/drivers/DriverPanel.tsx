import { useQuery } from "react-query";
import { FiMapPin, FiCheckCircle, FiPlay, FiFlag, FiMap, FiClock } from "react-icons/fi";
import { fetchMyDriverProfile } from "../../api/driverApi";
import { useUpdateRouteStatus, useMarkStopVisited } from "../../hooks/useRoutes";
import { RouteRecord, Stop } from "../../types";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Card, { CardHeader } from "../common/Card";
import EmptyState from "../common/EmptyState";
import { RouteStatusBadge } from "../common/Badge";

interface DriverProfileWithRoutes {
  user?: { name: string };
  vehicle?: { plateNumber: string } | null;
  routes?: RouteRecord[];
}

export default function DriverPanel() {
  const { data: driver, isLoading } = useQuery<DriverProfileWithRoutes>(
    "my-driver-profile",
    fetchMyDriverProfile
  );
  const updateStatus = useUpdateRouteStatus();
  const markVisited = useMarkStopVisited();

  if (isLoading) return <Loader label="Loading your assignments..." />;
  if (!driver)
    return (
      <EmptyState
        icon={<FiMapPin />}
        title="No driver profile found"
        description="Contact your dispatcher to get set up."
      />
    );

  const activeRoutes = driver.routes || [];
  const currentRoute = activeRoutes.find((r) => r.status === "IN_PROGRESS") || activeRoutes[0];

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-sm font-semibold text-white">
          {driver.user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">{driver.user?.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Vehicle: {driver.vehicle?.plateNumber || "Unassigned"}
          </p>
        </div>
      </Card>

      {activeRoutes.length === 0 && (
        <EmptyState
          icon={<FiMapPin />}
          title="No routes assigned"
          description="New assignments will appear here as soon as dispatch schedules them."
        />
      )}

      {activeRoutes.map((route) => {
        const stops = route.stops as Stop[];
        const remainingStops = stops.filter((s) => !s.visited);
        const remainingDistanceKm = remainingStops.reduce((sum, s) => sum + s.distanceFromPrevKm, 0);
        const remainingMinutes = remainingStops.reduce((sum, s) => sum + s.durationFromPrevMin, 0);
        const estimatedArrival =
          remainingStops.length > 0
            ? new Date(Date.now() + remainingMinutes * 60000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })
            : "Arrived";

        return (
          <Card key={route.id}>
            <CardHeader
              title={route.name}
              subtitle={route.id === currentRoute?.id ? "Current route" : undefined}
              action={<RouteStatusBadge status={route.status} />}
            />

            <div className="mb-4 grid grid-cols-3 gap-3">
              <RemainingMetric
                icon={<FiMapPin />}
                label="Remaining Stops"
                value={`${remainingStops.length}`}
              />
              <RemainingMetric
                icon={<FiMap />}
                label="Remaining Distance"
                value={`${remainingDistanceKm.toFixed(1)} km`}
              />
              <RemainingMetric icon={<FiClock />} label="Est. Arrival" value={estimatedArrival} />
            </div>

            <ul className="space-y-2">
              {stops.map((stop) => (
                <li
                  key={stop.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-800/60"
                >
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-500 shadow-soft dark:bg-slate-900">
                      {stop.sequence}
                    </span>
                    {stop.label}
                  </span>
                  {stop.visited ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <FiCheckCircle className="h-3.5 w-3.5" />
                      Visited
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markVisited.mutate({ routeId: route.id, stopId: stop.id })}
                    >
                      Mark Visited
                    </Button>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                icon={<FiPlay />}
                onClick={() => updateStatus.mutate({ id: route.id, status: "IN_PROGRESS" })}
              >
                Start Route
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={<FiFlag />}
                onClick={() => updateStatus.mutate({ id: route.id, status: "COMPLETED" })}
              >
                Complete Route
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function RemainingMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/60">
      <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-500 shadow-soft dark:bg-slate-900">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
