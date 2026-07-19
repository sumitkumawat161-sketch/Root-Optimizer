import { FiTruck, FiEdit2, FiTrash2, FiZap, FiPackage } from "react-icons/fi";
import { Vehicle } from "../../types";
import { VehicleStatusBadge } from "../common/Badge";
import Card from "../common/Card";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export default function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-600 dark:text-brand-400">
            <FiTruck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{vehicle.plateNumber}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{vehicle.type}</p>
          </div>
        </div>
        <VehicleStatusBadge status={vehicle.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <FiPackage className="h-4 w-4 text-slate-400" />
          {vehicle.capacityKg}kg
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <FiZap className="h-4 w-4 text-slate-400" />
          {vehicle.fuelEfficiency} km/L
        </div>
      </div>

      {(() => {
        const limit = vehicle.maxWeight ?? vehicle.capacityKg;
        const usagePct = limit > 0 ? Math.min((vehicle.currentLoad / limit) * 100, 100) : 0;
        return (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Load</span>
              <span>
                {vehicle.currentLoad}kg / {limit}kg
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${usagePct >= 90 ? "bg-red-500" : "bg-brand-gradient"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        );
      })()}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(vehicle)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300"
        >
          <FiEdit2 className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(vehicle.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-100 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
        >
          <FiTrash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </Card>
  );
}
