interface LoaderProps {
  label?: string;
}

export default function Loader({ label = "Loading..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-brand-100 dark:border-slate-800" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function PageLoader({ label = "Loading your workspace..." }: LoaderProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-surface-light dark:bg-surface-dark">
      <Loader label={label} />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="surface-card p-5">
      <div className="skeleton mb-3 h-4 w-1/3 rounded-lg" />
      <div className="skeleton mb-2 h-3 w-2/3 rounded-lg" />
      <div className="skeleton h-3 w-1/2 rounded-lg" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="space-y-3 p-5">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="skeleton h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
