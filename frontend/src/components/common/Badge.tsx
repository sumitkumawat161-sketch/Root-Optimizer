import { ReactNode } from "react";
import { FiCheckCircle, FiClock, FiXCircle, FiTruck, FiTool } from "react-icons/fi";

interface BadgeProps {
  children: ReactNode;
  color?: "slate" | "blue" | "green" | "amber" | "red" | "teal" | "violet";
  icon?: ReactNode;
}

const colorClasses: Record<string, string> = {
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
};

export default function Badge({ children, color = "slate", icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses[color]}`}
    >
      {icon}
      {children}
    </span>
  );
}

const routeStatusMap: Record<string, { color: BadgeProps["color"]; icon: ReactNode; label: string }> = {
  PLANNED: { color: "slate", icon: <FiClock className="h-3 w-3" />, label: "Planned" },
  IN_PROGRESS: { color: "blue", icon: <FiTruck className="h-3 w-3" />, label: "In Progress" },
  COMPLETED: { color: "green", icon: <FiCheckCircle className="h-3 w-3" />, label: "Completed" },
  CANCELLED: { color: "red", icon: <FiXCircle className="h-3 w-3" />, label: "Cancelled" }
};

const vehicleStatusMap: Record<string, { color: BadgeProps["color"]; icon: ReactNode; label: string }> = {
  AVAILABLE: { color: "green", icon: <FiCheckCircle className="h-3 w-3" />, label: "Available" },
  ON_ROUTE: { color: "blue", icon: <FiTruck className="h-3 w-3" />, label: "On Route" },
  MAINTENANCE: { color: "amber", icon: <FiTool className="h-3 w-3" />, label: "Maintenance" }
};

export function RouteStatusBadge({ status }: { status: string }) {
  const meta = routeStatusMap[status] || routeStatusMap.PLANNED;
  return (
    <Badge color={meta.color} icon={meta.icon}>
      {meta.label}
    </Badge>
  );
}

export function VehicleStatusBadge({ status }: { status: string }) {
  const meta = vehicleStatusMap[status] || vehicleStatusMap.AVAILABLE;
  return (
    <Badge color={meta.color} icon={meta.icon}>
      {meta.label}
    </Badge>
  );
}
