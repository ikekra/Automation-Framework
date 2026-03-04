import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  const deleteHistoryItem = useFrameworkStore((state) => state.deleteHistoryItem);
  const [showSkeletons, setShowSkeletons] = useState(true);
  const { openUserModal } = useUserModal();
  const { pushToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeletons(false), 320);
    return () => clearTimeout(timer);
  }, []);

  const totalGenerated = history.length;
  const usageCount = history.reduce((sum, item) => sum + (item.filesCount || 0), 0);
  const recentGenerations = history.slice(0, 5);

  return (
    <PageShell
      title="Dashboard"
      subtitle="Overview of your AI automation framework generation workspace."
      action={(
        <button
          type="button"
          onClick={openUserModal}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/60 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 text-[11px] font-semibold text-white">
            {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden sm:block">Account</span>
        </button>
      )}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(240px,320px),1fr]">
        <aside className="order-2 space-y-4 lg:order-1">
          <GlassCard className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">Features</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Start from here</h2>
            <p className="mt-2 text-sm text-muted">
              Quick actions and core capabilities of your automation workspace.
            </p>
          </GlassCard>

          <div className="space-y-3">
            {[
              {
                to: "/framework-builder",
                title: "Framework Builder",
                description: "Compose a tech stack and generate a ready-to-run framework."
              },
              {
                to: "/web-app-tester",
                title: "Web App Tester",
                description: "Run an automated scan with performance and console insights."
              },
              {
                to: "/history",
                title: "Generation History",
                description: "Review, download, or delete past framework builds."
              }
            ].map((item) => (
              <Link key={item.to} to={item.to} className="block">
                <GlassCard hover className="group p-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="mt-1 text-xs text-muted">{item.description}</p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    Open
                    <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </GlassCard>
              </Link>
            ))}

            {user?.role === "admin" ? (
              <Link to="/internal-self-test" className="block">
                <GlassCard hover className="group p-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Internal QA</p>
                  <p className="mt-1 text-xs text-muted">Run an internal self-test to validate the system.</p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    Open
                    <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </GlassCard>
              </Link>
            ) : null}
          </div>
        </aside>

        <div className="order-1 space-y-5 lg:order-2">
          <GlassCard className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Quick Actions</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">What would you like to do?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/framework-builder" className="btn-primary">
                  Build framework
                </Link>
                <Link to="/web-app-tester" className="btn-secondary">
                  Run web test
                </Link>
                <Link to="/history" className="btn-secondary">
                  View history
                </Link>
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
              <Link to="/profile" className="mt-3 inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                Manage profile
              </Link>
            </GlassCard>

            <GlassCard hover className="p-5">
              <p className="text-sm text-muted">Total Frameworks Generated</p>
              {showSkeletons ? (
                <Skeleton className="mt-3 h-9 w-16" />
              ) : (
                <AnimatedCounter value={totalGenerated} className="mt-2 block text-3xl font-bold text-slate-900 dark:text-slate-100" />
              )}
              <Link to="/framework-builder" className="mt-3 inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                Create new
              </Link>
            </GlassCard>

            <GlassCard hover className="p-5">
              <p className="text-sm text-muted">Usage Count (Files Generated)</p>
              {showSkeletons ? (
                <Skeleton className="mt-3 h-9 w-20" />
              ) : (
                <AnimatedCounter value={usageCount} className="mt-2 block text-3xl font-bold text-cyan-600 dark:text-cyan-300" />
              )}
              <Link to="/history" className="mt-3 inline-flex text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                View output
              </Link>
            </GlassCard>
          </div>

          <GlassCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Generations</h2>
              <span className="text-xs text-muted">Latest 5</span>
            </div>

            {showSkeletons ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : recentGenerations.length === 0 ? (
              <EmptyState
                title="No generations yet"
                description="Build your first framework now to see recent activity here."
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
                    className="glow-hover rounded-2xl border border-white/25 bg-white/45 p-4 dark:border-white/10 dark:bg-slate-900/40"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.language} • {item.automationTool} • {item.testRunner}
                        </p>
                        <p className="text-xs text-muted">
                          {item.filesCount} files • {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {item.downloadLink ? (
                          <a href={item.downloadLink} target="_blank" rel="noreferrer" className="btn-secondary glow-hover">
                            Download
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            deleteHistoryItem(item.id);
                            pushToast({ message: "History item deleted.", tone: "success" });
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
