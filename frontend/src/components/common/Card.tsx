import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingClasses: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6"
};

export default function Card({
  children,
  padding = "md",
  hover = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`surface-card animate-fade-in ${paddingClasses[padding]} ${
        hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
