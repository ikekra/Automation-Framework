import { useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", short: "DB" },
  { to: "/framework-builder", label: "Builder", short: "BL" },
  { to: "/history", label: "History", short: "HS" },
  { to: "/web-app-tester", label: "Web Tester", short: "WT" },
  { to: "/internal-self-test", label: "Internal QA", short: "IQ", adminOnly: true }
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(false);

  const initials = useMemo(() => {
    const base = user?.name || user?.email || "U";
    return base.slice(0, 1).toUpperCase();
  }, [user]);

  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => !item.adminOnly || user?.role === "admin");
  }, [user?.role]);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-[auto,1fr] md:gap-5">
        <GlassCard
          className="relative overflow-hidden p-4 md:p-5"
          animate={{ width: collapsed ? 96 : 272 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="glow-hover absolute right-3 top-3 rounded-lg border border-white/30 bg-white/45 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200"
            aria-label="Toggle sidebar"
          >
            {collapsed ? ">" : "<"}
          </button>

          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-semibold text-white shadow-md">
              {initials}
            </div>
            <AnimatePresence>
              {!collapsed ? (
                <Motion.div
                  key="sidebar-user"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">AutoForge AI</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </Motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <nav className="space-y-2">
            {visibleNavItems.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center rounded-xl px-3 py-2 text-sm font-medium ${
                    active ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  {active ? (
                    <Motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 -z-10 rounded-xl bg-indigo-100/80 dark:bg-indigo-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  ) : null}
                  <span className="w-6 text-xs font-bold text-cyan-600 dark:text-cyan-300">{item.short}</span>
                  <AnimatePresence>
                    {!collapsed ? (
                      <Motion.span
                        key={`label-${item.to}`}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.18 }}
                      >
                        {item.label}
                      </Motion.span>
                    ) : null}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          <button type="button" onClick={onLogout} className="btn-secondary mt-8 w-full glow-hover">
            {collapsed ? "Out" : "Logout"}
          </button>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </GlassCard>
      </div>
    </div>
  );
};
