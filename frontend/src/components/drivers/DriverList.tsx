import { FiUsers, FiPhone, FiTruck, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { Driver } from "../../types";
import EmptyState from "../common/EmptyState";
import Badge from "../common/Badge";

interface DriverListProps {
  drivers: Driver[];
  onToggleAvailability: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export default function DriverList({ drivers, onToggleAvailability, onDelete }: DriverListProps) {
  if (drivers.length === 0) {
    return (
      <EmptyState icon={<FiUsers />} title="No drivers yet" description="Add a driver profile to assign routes." />
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Driver
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                License
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicle
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {drivers.map((driver) => (
              <tr key={driver.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient-soft text-xs font-semibold text-brand-600 dark:text-brand-400">
                      {driver.user?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {driver.user?.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <FiPhone className="h-3.5 w-3.5 text-slate-400" />
                    {driver.phone}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{driver.licenseNo}</td>
                <td className="px-5 py-3">
                  {driver.vehicle ? (
                    <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <FiTruck className="h-3.5 w-3.5 text-slate-400" />
                      {driver.vehicle.plateNumber}
                    </span>
                  ) : (
                    <span className="text-slate-400">Unassigned</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <Badge color={driver.available ? "green" : "slate"}>
                    {driver.available ? "Available" : "Unavailable"}
                  </Badge>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onToggleAvailability(driver)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300"
                    >
                      <FiRefreshCw className="h-3.5 w-3.5" />
                      Toggle
                    </button>
                    <button
                      onClick={() => onDelete(driver.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
