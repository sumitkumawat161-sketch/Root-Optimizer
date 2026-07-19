import { useQuery } from "react-query";
import { FiFileText } from "react-icons/fi";
import { fetchFuelReport } from "../../api/analyticsApi";
import { SkeletonTable } from "../common/Loader";
import { ErrorState } from "../common/Alert";
import EmptyState from "../common/EmptyState";

interface FuelReportRow {
  id: string;
  name: string;
  estimatedFuel: number;
  totalDistanceKm: number;
  createdAt: string;
  vehicle: { plateNumber: string } | null;
}

export default function ReportsTable() {
  const { data, isLoading, isError, refetch } = useQuery<FuelReportRow[]>("fuel-report", fetchFuelReport);

  if (isLoading) return <SkeletonTable />;
  if (isError) return <ErrorState title="Couldn't load the fuel report" onRetry={() => refetch()} />;
  if (!data || data.length === 0) {
    return <EmptyState icon={<FiFileText />} title="No report data yet" description="Once routes are created, fuel and distance reports will appear here." />;
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
                Fuel
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{row.name}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                  {row.vehicle?.plateNumber || "-"}
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{row.totalDistanceKm} km</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{row.estimatedFuel} L</td>
                <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                  {new Date(row.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
