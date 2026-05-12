import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { UserModalProvider } from "../context/UserModalContext";
import { useToast } from "../context/ToastContext";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Overview", short: "OV", description: "Workspace metrics and recent activity" },
  { to: "/framework-builder", label: "Builder", short: "BL", description: "Compose and generate starter frameworks" },
  { to: "/history", label: "Library", short: "LB", description: "Saved builds and authenticated downloads" },
  { to: "/web-app-tester", label: "Analyzer", short: "AN", description: "Web app quality diagnostics and AI insights" },
  { to: "/profile", label: "Settings", short: "ST", description: "Profile, security, and account configuration" },
  { to: "/internal-self-test", label: "Ops QA", short: "QA", description: "Internal diagnostics for admins", adminOnly: true }
];

const workspaceHighlights = [
  { label: "Availability", value: "99.9%", tone: "metric-tone-success" },
  { label: "Response SLA", value: "< 2 min", tone: "metric-tone-primary" },
  { label: "Security Layer", value: "JWT + 2FA", tone: "metric-tone-accent" }
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const resendVerification = useAuthStore((state) => state.resendVerification);
  const { pushToast } = useToast();

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    organization: user?.organization || "",
    phone: user?.phone || "",
    plan: user?.plan || "Starter"
  });
  const [profileMessage, setProfileMessage] = useState({ text: "", tone: "success" });

  const initials = useMemo(() => {
    const base = user?.name || user?.email || "U";
    return base.slice(0, 2).toUpperCase();
  }, [user]);

  const visibleNavItems = useMemo(
    () => navItems.filter((item) => !item.adminOnly || user?.role === "admin"),
    [user?.role]
  );

  const activeItem = useMemo(
    () => visibleNavItems.find((item) => location.pathname === item.to) || visibleNavItems[0],
    [location.pathname, visibleNavItems]
  );

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
    setMobileNavOpen(false);
  }, [location.pathname]);

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
      <div className="min-h-screen px-3 py-3 sm:px-4 md:px-5 md:py-5">
        <div className="shell-frame mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-[1600px] flex-col overflow-hidden rounded-[32px]">
          <header className="border-b border-white/20 bg-white/54 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/24 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen((prev) => !prev)}
                  className="btn-secondary px-3 py-2 lg:hidden"
                  aria-label="Toggle workspace navigation"
                >
                  Menu
                </button>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-soft">AutoForge Cloud</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <h1 className="text-lg font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                      Commercial QA Workspace
                    </h1>
                    <span className="brand-badge rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {activeItem?.label || "Workspace"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="grid grid-cols-3 gap-2">
                  {workspaceHighlights.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/30 bg-white/60 px-3 py-2 text-center dark:border-white/10 dark:bg-slate-900/42">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{item.label}</p>
                      <p className={`mt-1 text-sm font-bold ${item.tone}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="relative" data-account-menu>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="flex min-w-[220px] items-center justify-between gap-3 rounded-[22px] border border-white/30 bg-white/70 px-3 py-2.5 text-left shadow-sm dark:border-white/10 dark:bg-slate-900/46"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#0f9f8c)] text-xs font-bold text-white shadow-[0_16px_30px_-18px_rgba(37,99,235,0.68)]">
                        {initials}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name || "Workspace User"}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-soft">Open</span>
                  </button>

                  <AnimatePresence>
                    {accountMenuOpen ? (
                      <Motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 z-30 mt-3 w-64 overflow-hidden rounded-[24px] border border-white/30 bg-white/92 p-2.5 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.42)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/86"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setShowUserModal(true);
                          }}
                          className="w-full rounded-2xl px-3 py-2.5 text-left text-sm hover:bg-[color:var(--accent-soft)] dark:hover:bg-slate-900"
                        >
                          Account overview
                        </button>
                        <Link
                          to="/profile"
                          className="block rounded-2xl px-3 py-2.5 text-sm hover:bg-[color:var(--accent-soft)] dark:hover:bg-slate-900"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Profile and security
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setMobileNavOpen(false);
                            onLogout();
                          }}
                          className="w-full rounded-2xl px-3 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/35"
                        >
                          Logout
                        </button>
                      </Motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {user?.emailVerified === false ? (
            <div className="border-b border-amber-200/50 bg-amber-50/88 px-4 py-3 dark:border-amber-400/12 dark:bg-amber-500/10 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Verification pending</p>
                  <p className="text-xs text-amber-800/85 dark:text-amber-100/72">
                    Verify your email to unlock the full commercial workspace flow.
                  </p>
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
            </div>
          ) : null}

          <div className="flex flex-1 flex-col lg:flex-row">
            <AnimatePresence>
              {mobileNavOpen ? (
                <Motion.button
                  type="button"
                  className="fixed inset-0 z-20 bg-slate-950/36 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation"
                />
              ) : null}
            </AnimatePresence>

            <Motion.aside
              initial={false}
              animate={mobileNavOpen ? { x: 0 } : { x: 0 }}
              className={`${
                mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              } fixed inset-y-0 left-0 z-30 flex w-[310px] flex-col border-r border-white/20 bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(247,242,233,0.92),rgba(240,237,228,0.88))] px-4 py-5 shadow-[0_30px_70px_-42px_rgba(15,23,42,0.4)] transition-transform duration-300 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(13,23,21,0.98),rgba(16,29,26,0.95),rgba(20,37,34,0.92))] lg:static lg:w-[320px] lg:translate-x-0 lg:shadow-none`}
            >
              <div className="brand-gradient-soft rounded-[28px] border border-white/30 p-5 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-soft">Workspace</p>
                <h2 className="mt-2 text-xl font-extrabold text-slate-950 dark:text-slate-50">AutoForge Suite</h2>
                <p className="mt-2 text-sm text-soft">
                  A commercial-style command center for framework generation, test diagnostics, and delivery ops.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-slate-50 dark:bg-white dark:text-slate-950">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Plan</p>
                    <p className="mt-2 text-sm font-bold">{user?.plan || "Starter"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/35 bg-white/66 px-4 py-3 dark:border-white/10 dark:bg-slate-900/44">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Role</p>
                    <p className="mt-2 text-sm font-bold capitalize text-slate-900 dark:text-slate-100">{user?.role || "user"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/35 bg-white/66 px-4 py-3 dark:border-white/10 dark:bg-slate-900/44">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Last Login</p>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{lastLoginLabel}</p>
                  </div>
                </div>
              </div>

              <nav className="mt-5 flex-1 space-y-2">
                {visibleNavItems.map((item) => {
                  const active = location.pathname === item.to;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`group relative block overflow-hidden rounded-[24px] border px-4 py-3 ${
                        active
                          ? "border-[color:var(--border-strong)] bg-[color:var(--primary-ink)] shadow-[0_18px_40px_-34px_rgba(31,111,100,0.3)] dark:border-[color:var(--border-strong)] dark:bg-[color:var(--primary-ink)]"
                          : "border-transparent bg-transparent hover:border-white/30 hover:bg-white/45 dark:hover:border-white/10 dark:hover:bg-slate-900/38"
                      }`}
                    >
                      {active ? (
                        <Motion.span
                          layoutId="active-nav"
                          className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[linear-gradient(180deg,var(--primary),var(--accent))]"
                        />
                      ) : null}

                      <div className="flex items-start gap-3 pl-1">
                        <span className={`grid h-10 w-10 place-items-center rounded-2xl text-xs font-bold ${
                          active
                            ? "bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-white"
                            : "bg-white/80 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                        }`}>
                          {item.short}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold ${active ? "text-slate-950 dark:text-slate-50" : "text-slate-800 dark:text-slate-100"}`}>
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs text-muted">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-5 rounded-[24px] border border-white/30 bg-white/68 p-4 dark:border-white/10 dark:bg-slate-900/42">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Current Surface</p>
                <p className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{activeItem?.label}</p>
                <p className="mt-2 text-sm text-muted">{activeItem?.description}</p>
                <button type="button" onClick={onLogout} className="btn-secondary mt-4 w-full">
                  Sign out
                </button>
              </div>
            </Motion.aside>

            <main id="app-main" className="min-w-0 flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
              <div className="mx-auto w-full max-w-[1120px]">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

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
                className="absolute inset-0 cursor-default bg-slate-950/42 backdrop-blur-sm"
                onClick={() => setShowUserModal(false)}
                aria-label="Close user modal"
              />
              <Motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-lg"
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-sm font-bold text-white shadow-[0_18px_40px_-26px_rgba(31,111,100,0.4)]">
                        {initials}
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">{user?.name || "Workspace User"}</p>
                        <p className="text-sm text-muted">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUserModal(false)}
                      className="btn-secondary px-3 py-2"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Role", user?.role || "user"],
                      ["Plan", user?.plan || "Starter"],
                      ["Organization", user?.organization || "Not set"],
                      ["Phone", user?.phone || "Not set"],
                      ["Last Login", lastLoginLabel],
                      ["Status", user?.emailVerified ? "Verified" : "Verification pending"]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/20 bg-white/58 p-4 dark:border-white/10 dark:bg-slate-900/42">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button type="button" onClick={() => navigate("/profile")} className="btn-primary w-full">
                      Open profile
                    </button>
                    <button type="button" onClick={onLogout} className="btn-secondary w-full">
                      Logout
                    </button>
                  </div>

                  <div className="mt-6 border-t border-white/20 pt-5 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingProfile((prev) => !prev)}
                      className="btn-ghost w-full rounded-2xl border border-white/20 dark:border-white/10"
                    >
                      {editingProfile ? "Close quick edit" : "Quick edit account"}
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
                            <input className="input" name="name" value={profileForm.name} onChange={onProfileChange} required />
                          </label>
                          <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Organization
                            <input className="input" name="organization" value={profileForm.organization} onChange={onProfileChange} />
                          </label>
                          <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Phone
                            <input className="input" name="phone" value={profileForm.phone} onChange={onProfileChange} />
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
                            <p className={`text-xs ${profileMessage.tone === "error" ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300"}`}>
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
