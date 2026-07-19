import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: "brand" | "teal" | "violet" | "amber";
  trend?: string;
}

const accentClasses: Record<string, string> = {
  brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
  teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
};

export function StatCard({ label, value, icon, accent = "brand", trend }: StatCardProps) {
  return (
    <div className="surface-card group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${accentClasses[accent]}`}>
          {icon}
        </div>
        {trend && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
