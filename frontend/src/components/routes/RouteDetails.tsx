import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiPlay, FiCheckCircle, FiXCircle, FiMap, FiClock, FiDroplet } from "react-icons/fi";
import { useRoute, useUpdateRouteStatus } from "../../hooks/useRoutes";
import RouteMap from "../map/RouteMap";
import Loader from "../common/Loader";
import Button from "../common/Button";
import Card, { CardHeader } from "../common/Card";
import { RouteStatusBadge } from "../common/Badge";
import { ErrorState } from "../common/Alert";

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: route, isLoading, isError, refetch } = useRoute(id || "");
  const updateStatus = useUpdateRouteStatus();

  if (isLoading) return <Loader label="Loading route..." />;
  if (isError || !route) return <ErrorState title="Route not found" onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      <Link
        to="/planner"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 dark:text-slate-400"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to planner
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={route.name}
              subtitle={`Algorithm: ${route.algorithm.replace("-", " ")}`}
              action={<RouteStatusBadge status={route.status} />}
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricTile icon={<FiMap />} label="Distance" value={`${route.totalDistance} km`} />
              <MetricTile
                icon={<FiClock />}
                label="Travel Time"
                value={route.totalTravelTime != null ? `${Math.round(route.totalTravelTime)} min` : "-"}
              />
              <MetricTile
                icon={<FiClock />}
                label="ETA"
                value={route.eta ? new Date(route.eta).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
              />
              <MetricTile icon={<FiDroplet />} label="Fuel" value={`${route.estimatedFuel} L`} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                size="sm"
                icon={<FiPlay />}
                onClick={() => updateStatus.mutate({ id: route.id, status: "IN_PROGRESS" })}
              >
                Start
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={<FiCheckCircle />}
                onClick={() => updateStatus.mutate({ id: route.id, status: "COMPLETED" })}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={<FiXCircle />}
                onClick={() => updateStatus.mutate({ id: route.id, status: "CANCELLED" })}
              >
                Cancel
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Stops" subtitle={`${route.stops.length} stops on this route`} />
            <ul className="space-y-1.5">
              {route.stops.map((stop) => (
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
                  <span
                    className={
                      stop.visited
                        ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        : "text-xs font-medium text-slate-400"
                    }
                  >
                    {stop.visited ? "Visited" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:h-auto lg:min-h-[560px]">
          <RouteMap stops={route.stops} geometry={route.geometry} />
        </div>
      </div>
    </div>
  );
}

function MetricTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
