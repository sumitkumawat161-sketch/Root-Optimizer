import { ReactNode } from "react";
import { FiNavigation, FiMap, FiTruck, FiActivity } from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle";

const highlights = [
  { icon: FiMap, text: "AI-assisted route optimization in seconds" },
  { icon: FiTruck, text: "Live fleet visibility across every vehicle" },
  { icon: FiActivity, text: "Actionable analytics on fuel & efficiency" }
];

export default function AuthLayout({
  children,
  title,
  subtitle
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-surface-light dark:bg-surface-dark lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <FiNavigation className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">RouteOpt</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Smarter routes.
            <br />
            Faster deliveries.
          </h2>
          <p className="mt-3 text-sm text-white/80">
            One dashboard to plan, optimize, and track every vehicle in your fleet in real time.
          </p>

          <div className="mt-8 space-y-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-white/90">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} RouteOpt. All rights reserved.
        </p>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <FiNavigation className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">RouteOpt</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-2 hidden justify-end lg:flex">
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
