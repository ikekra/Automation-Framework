import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageShell } from "../components/PageShell";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuthStore } from "../store/authStore";
import { useFrameworkStore } from "../store/frameworkStore";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const history = useFrameworkStore((state) => state.history);
  const deleteHistoryItem = useFrameworkStore((state) => state.deleteHistoryItem);
  const [showSkeletons, setShowSkeletons] = useState(true);

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
    >
      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard hover className="p-5">
          <p className="text-sm text-muted">Account</p>
          {showSkeletons ? (
            <Skeleton className="mt-3 h-7 w-44" />
          ) : (
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{user?.name || user?.email}</p>
          )}
        </GlassCard>

        <GlassCard hover className="p-5">
          <p className="text-sm text-muted">Total Frameworks Generated</p>
          {showSkeletons ? (
            <Skeleton className="mt-3 h-9 w-16" />
          ) : (
            <AnimatedCounter value={totalGenerated} className="mt-2 block text-3xl font-bold text-slate-900 dark:text-slate-100" />
          )}
        </GlassCard>

        <GlassCard hover className="p-5">
          <p className="text-sm text-muted">Usage Count (Files Generated)</p>
          {showSkeletons ? (
            <Skeleton className="mt-3 h-9 w-20" />
          ) : (
            <AnimatedCounter value={usageCount} className="mt-2 block text-3xl font-bold text-cyan-600 dark:text-cyan-300" />
          )}
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
          <p className="text-sm text-muted">No generations yet. Build your first framework from Builder.</p>
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
                      onClick={() => deleteHistoryItem(item.id)}
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
    </PageShell>
  );
};

