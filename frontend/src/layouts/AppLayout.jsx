import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { UserModalProvider } from "../context/UserModalContext";
import { useToast } from "../context/ToastContext";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", short: "DB" },
  { to: "/profile", label: "Profile", short: "PR" },
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
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const resendVerification = useAuthStore((state) => state.resendVerification);
  const { pushToast } = useToast();

  const [collapsed, setCollapsed] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    organization: user?.organization || "",
    phone: user?.phone || "",
    plan: user?.plan || "Starter"
  });
  const [profileMessage, setProfileMessage] = useState({ text: "", tone: "success" });

  const initials = useMemo(() => {
    const base = user?.name || user?.email || "U";
    return base.slice(0, 1).toUpperCase();
  }, [user]);

  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => !item.adminOnly || user?.role === "admin");
  }, [user?.role]);

  const lastLoginLabel = useMemo(() => {
    if (!user?.lastLogin) {
      return "Unavailable";
    }

    const parsed = new Date(user.lastLogin);
    if (Number.isNaN(parsed.getTime())) {
      return "Unavailable";
    }

    return parsed.toLocaleString();
  }, [user?.lastLogin]);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const onSwitchAccount = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const onProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const onProfileSave = async (event) => {
    event.preventDefault();
    setProfileMessage({ text: "", tone: "success" });

    try {
      await updateProfile({
        name: profileForm.name.trim(),
        organization: profileForm.organization.trim() || null,
        phone: profileForm.phone.trim() || null,
        plan: profileForm.plan
      });
      setProfileMessage({ text: "Profile updated.", tone: "success" });
      pushToast({ message: "Profile updated.", tone: "success" });
    } catch (error) {
      const message = error?.message || "Failed to update profile.";
      setProfileMessage({ text: message, tone: "error" });
      pushToast({ message, tone: "error" });
    }
  };

  useEffect(() => {
    if (!showUserModal) {
      setEditingProfile(false);
      setProfileMessage({ text: "", tone: "success" });
    }
  }, [showUserModal]);

  useEffect(() => {
    if (!showUserModal) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowUserModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showUserModal]);

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      organization: user?.organization || "",
      phone: user?.phone || "",
      plan: user?.plan || "Starter"
    });
  }, [user?.name, user?.organization, user?.phone, user?.plan]);

  useEffect(() => {
    const onBodyClick = (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      if (event.target.closest("[data-account-menu]")) {
        return;
      }

      setAccountMenuOpen(false);
    };

    window.addEventListener("click", onBodyClick);
    return () => window.removeEventListener("click", onBodyClick);
  }, []);

  return (
    <UserModalProvider value={{ openUserModal: () => setShowUserModal(true) }}>
      <div className="min-h-screen p-4 md:p-6">
        <div className="mx-auto mb-3 flex w-full max-w-7xl items-center justify-between gap-4 md:mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Workspace</p>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">AutoForge Console</p>
          </div>
          <div className="relative" data-account-menu>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-xs font-semibold text-white">
                {initials}
              </span>
              <span className="hidden sm:block">{user?.name || user?.email}</span>
            </button>

            <AnimatePresence>
              {accountMenuOpen ? (
                <Motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/30 bg-white/80 p-2 text-sm shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/80"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setShowUserModal(true);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left hover:bg-white/70 dark:hover:bg-slate-800/70"
                  >
                    Account overview
                  </button>
                  <Link
                    to="/profile"
                    className="block rounded-xl px-3 py-2 hover:bg-white/70 dark:hover:bg-slate-800/70"
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    Profile & security
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-rose-600 hover:bg-rose-50/80 dark:text-rose-300 dark:hover:bg-rose-950/40"
                  >
                    Logout
                  </button>
                </Motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {user?.emailVerified === false ? (
          <GlassCard className="mx-auto mb-4 w-full max-w-7xl p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Verify your email</p>
                <p className="text-xs text-muted">Please verify your email to unlock the full workspace.</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await resendVerification({ email: user?.email });
                    pushToast({ message: "Verification email sent.", tone: "success" });
                  } catch (error) {
                    pushToast({ message: error?.response?.data?.message || "Failed to resend email.", tone: "error" });
                  }
                }}
                className="btn-secondary"
              >
                Resend verification
              </button>
            </div>
          </GlassCard>
        ) : null}

        <main id="app-main" className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-[auto,1fr] md:gap-5">
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

            <button
              type="button"
              onClick={() => setShowUserModal(true)}
              className="mb-7 flex w-full items-center gap-3 text-left"
            >
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
            </button>

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
        </main>

        <AnimatePresence>
          {showUserModal ? (
            <Motion.div
              key="user-modal"
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-sm"
                onClick={() => setShowUserModal(false)}
                aria-label="Close user modal"
              />
              <Motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md"
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-base font-semibold text-white shadow-md">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || "User"}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUserModal(false)}
                      className="rounded-lg border border-white/30 bg-white/55 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 space-y-3 rounded-2xl border border-white/20 bg-white/50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.22em] text-muted">Role</span>
                      <span className="text-sm font-semibold capitalize">{user?.role || "user"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.22em] text-muted">Status</span>
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization</span>
                      <span className="text-sm font-semibold">{user?.organization || "Not set"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.22em] text-muted">Plan</span>
                      <span className="text-sm font-semibold">{user?.plan || "Starter"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.22em] text-muted">Last Login</span>
                      <span className="text-sm font-semibold">{lastLoginLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.22em] text-muted">Phone</span>
                      <span className="text-sm font-semibold">{user?.phone || "Not set"}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <button type="button" onClick={onSwitchAccount} className="btn-primary w-full">
                      Login with different account
                    </button>
                    <button type="button" onClick={onLogout} className="btn-secondary w-full">
                      Logout
                    </button>
                  </div>

                  <div className="mt-5 border-t border-white/20 pt-5 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingProfile((prev) => !prev)}
                      className="btn-secondary w-full"
                    >
                      {editingProfile ? "Close edit" : "Edit profile here"}
                    </button>

                    <AnimatePresence>
                      {editingProfile ? (
                        <Motion.form
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 space-y-3"
                          onSubmit={onProfileSave}
                        >
                          <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Name
                            <input
                              className="input"
                              name="name"
                              value={profileForm.name}
                              onChange={onProfileChange}
                              required
                            />
                          </label>
                          <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Organization
                            <input
                              className="input"
                              name="organization"
                              value={profileForm.organization}
                              onChange={onProfileChange}
                            />
                          </label>
                          <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Phone
                            <input
                              className="input"
                              name="phone"
                              value={profileForm.phone}
                              onChange={onProfileChange}
                            />
                          </label>
                          <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Plan
                            <select className="input" name="plan" value={profileForm.plan} onChange={onProfileChange}>
                              {["Starter", "Pro", "Enterprise"].map((plan) => (
                                <option key={plan} value={plan}>
                                  {plan}
                                </option>
                              ))}
                            </select>
                          </label>

                          {profileMessage.text ? (
                            <p
                              className={`text-xs ${
                                profileMessage.tone === "error"
                                  ? "text-rose-600 dark:text-rose-300"
                                  : "text-emerald-600 dark:text-emerald-300"
                              }`}
                            >
                              {profileMessage.text}
                            </p>
                          ) : null}

                          <button type="submit" className="btn-primary w-full">
                            Save profile
                          </button>
                        </Motion.form>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </GlassCard>
              </Motion.div>
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </UserModalProvider>
  );
};
