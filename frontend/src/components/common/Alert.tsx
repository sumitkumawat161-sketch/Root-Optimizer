import { ReactNode } from "react";
import { FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

interface AlertProps {
  children: ReactNode;
  variant?: "error" | "warning" | "success" | "info";
}

const variantConfig: Record<
  string,
  { classes: string; icon: ReactNode }
> = {
  error: {
    classes:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
    icon: <FiAlertCircle className="h-4 w-4 shrink-0" />
  },
  warning: {
    classes:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    icon: <FiAlertTriangle className="h-4 w-4 shrink-0" />
  },
  success: {
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    icon: <FiCheckCircle className="h-4 w-4 shrink-0" />
  },
  info: {
    classes:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
    icon: <FiInfo className="h-4 w-4 shrink-0" />
  }
};

export default function Alert({ children, variant = "error" }: AlertProps) {
  const config = variantConfig[variant];
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm animate-fade-in ${config.classes}`}
    >
      {config.icon}
      <span>{children}</span>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete this request. Please try again.",
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="surface-card flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-500 dark:bg-red-500/10">
        <FiAlertTriangle />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
