import { Link } from "react-router-dom";
import { FiMap, FiArrowRight } from "react-icons/fi";
import { RouteRecord } from "../../types";
import { RouteStatusBadge } from "../common/Badge";
import EmptyState from "../common/EmptyState";

interface RouteListProps {
  routes: RouteRecord[];
}

export default function RouteList({ routes }: RouteListProps) {
  if (routes.length === 0) {
    return (
      <EmptyState
        icon={<FiMap />}
        title="No routes yet"
        description="Generate your first optimized route using the planner above."
      />
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Route
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicle
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Distance
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                ETA
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fuel
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {routes.map((route) => (
              <tr key={route.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{route.name}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                  {route.vehicle?.plateNumber || "-"}
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{route.totalDistanceKm} km</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{route.etaMinutes} min</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{route.estimatedFuel} L</td>
                <td className="px-5 py-3">
                  <RouteStatusBadge status={route.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    to={`/planner/${route.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    Details
                    <FiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
