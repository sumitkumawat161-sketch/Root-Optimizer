import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiMap,
  FiTruck,
  FiUsers,
  FiActivity,
  FiShield,
  FiNavigation,
  FiX
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid, roles: ["ADMIN", "DISPATCHER", "DRIVER"] },
  { to: "/planner", label: "Route Planner", icon: FiMap, roles: ["ADMIN", "DISPATCHER"] },
  { to: "/vehicles", label: "Vehicles", icon: FiTruck, roles: ["ADMIN", "DISPATCHER"] },
  { to: "/drivers", label: "Driver Panel", icon: FiUsers, roles: ["ADMIN", "DISPATCHER", "DRIVER"] },
  { to: "/tracking", label: "Live Tracking", icon: FiNavigation, roles: ["ADMIN", "DISPATCHER", "DRIVER"] },
  { to: "/analytics", label: "Analytics", icon: FiActivity, roles: ["ADMIN", "DISPATCHER"] },
  { to: "/admin", label: "Admin Panel", icon: FiShield, roles: ["ADMIN"] }
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const { user } = useAuth();
  const visibleLinks = links.filter((link) => !user || link.roles.includes(user.role));

  const content = (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
            <FiNavigation className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">RouteOpt</p>
            <p className="mt-1 text-[11px] font-medium text-slate-400">Fleet Intelligence</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-brand-gradient-soft p-4">
        <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">Need help?</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Check the driver handbook or contact dispatch support.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative z-10 flex h-full w-72 animate-slide-in-right flex-col bg-white p-4 shadow-2xl dark:bg-slate-900">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
