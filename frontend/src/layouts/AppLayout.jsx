import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/framework-builder", label: "Builder" },
  { to: "/history", label: "History" }
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initials = useMemo(() => {
    const base = user?.name || user?.email || "U";
    return base.slice(0, 1).toUpperCase();
  }, [user]);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-[260px,1fr]">
        <aside className="card p-4 md:p-5">
          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">AutoForge AI</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                    active ? "text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 -z-10 rounded-xl bg-indigo-50"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button type="button" onClick={onLogout} className="btn-secondary mt-8 w-full">
            Logout
          </button>
        </aside>

        <main className="card p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
