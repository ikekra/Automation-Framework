import { motion as Motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";
import { EmptyState } from "../components/ui/EmptyState";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useUserModal } from "../context/UserModalContext";
import { useToast } from "../context/ToastContext";
import { useAuthStore } from "../store/authStore";
import { useFrameworkStore } from "../store/frameworkStore";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const history = useFrameworkStore((state) => state.history);
  const loading = useFrameworkStore((state) => state.loading);
  const bootstrapped = useFrameworkStore((state) => state.bootstrapped);
  const fetchHistory = useFrameworkStore((state) => state.fetchHistory);
  const deleteHistoryItem = useFrameworkStore((state) => state.deleteHistoryItem);
  const downloadHistoryItem = useFrameworkStore((state) => state.downloadHistoryItem);
  const [showSkeletons, setShowSkeletons] = useState(true);
  const { openUserModal } = useUserModal();
  const { pushToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeletons(false), 320);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!bootstrapped) {
      fetchHistory({ page: 1, limit: 10 }).catch((error) => {
        pushToast({ message: error?.response?.data?.message || "Failed to load framework history.", tone: "error" });
      });
    }
  }, [bootstrapped, fetchHistory, pushToast]);

  const totalGenerated = history.length;
  const usageCount = history.reduce((sum, item) => sum + (item.filesCount || 0), 0);
  const recentGenerations = useMemo(() => history.slice(0, 5), [history]);

  return (
    <PageShell
      title="Command Center"
      subtitle="Your AI automation workspace is now backed by account history, authenticated downloads, and cleaner delivery flow."
      eyebrow="Console"
      action={(
        <button
          type="button"
          onClick={openUserModal}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-[color:var(--primary-deep)] px-3 py-2 text-sm font-semibold text-white shadow-sm dark:border-white/10 dark:bg-[color:var(--primary)] dark:text-slate-950"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-[11px] font-semibold text-current">
            {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden sm:block">Account</span>
        </button>
      )}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(260px,320px),1fr]">
        <aside className="order-2 space-y-4 lg:order-1">
          <GlassCard className="overflow-hidden p-0">
            <div className="brand-gradient-panel px-5 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">Workspace Status</p>
              <h2 className="mt-2 text-lg font-semibold">Start from the strongest path</h2>
              <p className="mt-2 text-sm text-slate-300">
                Build frameworks, inspect analyzer output, and keep a real account-level history instead of local-only state.
              </p>
            </div>
            <div className="space-y-3 p-4">
              {[
                {
                  to: "/framework-builder",
                  title: "Framework Builder",
                  description: "Compose a stack and save the generated framework directly to your account."
                },
                {
                  to: "/web-app-tester",
                  title: "Web App Tester",
                  description: "Run an automated scan with console, network, AI, and performance insights."
                },
                {
                  to: "/history",
                  title: "Framework History",
                  description: "Review saved builds, authenticated downloads, and cleanup actions."
                }
              ].map((item) => (
                <Link key={item.to} to={item.to} className="block">
                  <GlassCard hover className="group p-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">{item.description}</p>
                    <span className="link-accent mt-3 inline-flex items-center text-xs font-semibold">
                      Open
                      <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">{"->"}</span>
                    </span>
                  </GlassCard>
                </Link>
              ))}

              {user?.role === "admin" ? (
                <Link to="/internal-self-test" className="block">
                  <GlassCard hover className="group p-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Internal QA</p>
                    <p className="mt-1 text-xs text-muted">Run a diagnostics sweep for database, routes, auth, and OpenAI integration.</p>
                    <span className="link-accent mt-3 inline-flex items-center text-xs font-semibold">
                      Open
                      <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">{"->"}</span>
                    </span>
                  </GlassCard>
                </Link>
              ) : null}
            </div>
          </GlassCard>
        </aside>

        <div className="order-1 space-y-5 lg:order-2">
          <GlassCard className="overflow-hidden p-0">
            <div className="brand-gradient-panel grid gap-4 px-5 py-6 text-white md:grid-cols-[1.2fr,0.8fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/74">Quick Actions</p>
                <p className="mt-3 text-2xl font-bold">Build, test, and ship from one surface.</p>
                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  The app is now wired around authenticated framework records, so your generated output stays attached to your account.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to="/framework-builder" className="btn-primary border-0 bg-white text-slate-950 hover:bg-slate-100">
                    Build framework
                  </Link>
                  <Link to="/web-app-tester" className="btn-secondary border-white/25 bg-white/10 text-white hover:bg-white/20">
                    Run web test
                  </Link>
                  <Link to="/history" className="btn-secondary border-white/25 bg-white/10 text-white hover:bg-white/20">
                    View history
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Verified</p>
                  <p className="mt-2 text-lg font-semibold">{user?.emailVerified ? "Ready" : "Pending"}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Plan</p>
                  <p className="mt-2 text-lg font-semibold">{user?.plan || "Starter"}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Role</p>
                  <p className="mt-2 text-lg font-semibold capitalize">{user?.role || "user"}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-3">
            <GlassCard hover className="p-5">
              <p className="text-sm text-muted">Account</p>
              {showSkeletons ? (
                <Skeleton className="mt-3 h-7 w-44" />
              ) : (
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{user?.name || user?.email}</p>
              )}
              <Link to="/profile" className="link-accent mt-3 inline-flex text-xs font-semibold">
                Manage profile
              </Link>
            </GlassCard>

            <GlassCard hover className="p-5">
              <p className="text-sm text-muted">Saved Frameworks</p>
              {showSkeletons || (loading && !bootstrapped) ? (
                <Skeleton className="mt-3 h-9 w-16" />
              ) : (
                <AnimatedCounter value={totalGenerated} className="mt-2 block text-3xl font-bold text-slate-900 dark:text-slate-100" />
              )}
              <Link to="/framework-builder" className="link-accent mt-3 inline-flex text-xs font-semibold">
                Create new
              </Link>
            </GlassCard>

            <GlassCard hover className="p-5">
              <p className="text-sm text-muted">Files Generated</p>
              {showSkeletons || (loading && !bootstrapped) ? (
                <Skeleton className="mt-3 h-9 w-20" />
              ) : (
                <AnimatedCounter value={usageCount} className="mt-2 block text-3xl font-bold text-emerald-600 dark:text-emerald-300" />
              )}
              <Link to="/history" className="link-accent mt-3 inline-flex text-xs font-semibold">
                View output
              </Link>
            </GlassCard>
          </div>

          <GlassCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Framework Builds</h2>
              <span className="text-xs text-muted">Latest 5</span>
            </div>

            {showSkeletons || (loading && !bootstrapped) ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : recentGenerations.length === 0 ? (
              <EmptyState
                title="No builds yet"
                description="Create your first framework now and it will appear here as account history."
                action={(
                  <Link to="/framework-builder" className="btn-primary">
                    Build framework
                  </Link>
                )}
              />
            ) : (
              <div className="space-y-3">
                {recentGenerations.map((item, index) => (
                  <Motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-3xl border border-white/25 bg-white/45 p-4 dark:border-white/10 dark:bg-slate-900/40"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.language} | {item.automationTool} | {item.testRunner}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {item.filesCount} files | {item.folderCount} folders | {new Date(item.createdAt).toLocaleString()}
                        </p>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                          Pattern: {item.pattern} | CI/CD: {item.cicd}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            downloadHistoryItem(item).catch((error) => {
                              pushToast({ message: error?.response?.data?.message || error?.message || "Download failed.", tone: "error" });
                            });
                          }}
                          className="btn-secondary glow-hover"
                        >
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteHistoryItem(item.id)
                              .then(() => pushToast({ message: "Framework deleted from history.", tone: "success" }))
                              .catch((error) => {
                                pushToast({ message: error?.response?.data?.message || "Failed to delete framework.", tone: "error" });
                              });
                          }}
                          className="btn-secondary border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Motion.article>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </PageShell>
  );
};
