import { Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";
import ThemeToggle from "../components/common/ThemeToggle";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-surface-light px-6 text-center dark:bg-surface-dark">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient-soft text-3xl text-brand-500">
        <FiAlertTriangle />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white shadow-glow transition hover:brightness-110"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
    </div>
  );
}
