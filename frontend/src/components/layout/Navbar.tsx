import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiChevronDown, FiUser } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

interface NavbarProps {
  onMenuClick: () => void;
}

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  DISPATCHER: "Dispatcher",
  DRIVER: "Driver"
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <h1 className="hidden text-base font-semibold text-slate-800 dark:text-slate-100 sm:block">
          Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-xs font-semibold text-white">
              {initials || <FiUser className="h-4 w-4" />}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-none text-slate-700 dark:text-slate-200">
                {user?.name}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {user ? roleLabels[user.role] : ""}
              </p>
            </div>
            <FiChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 animate-scale-in rounded-xl border border-slate-200 bg-white p-1.5 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <FiLogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
