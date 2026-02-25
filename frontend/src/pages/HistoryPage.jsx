import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageShell } from "../components/PageShell";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useFrameworkStore } from "../store/frameworkStore";

export const HistoryPage = () => {
  const history = useFrameworkStore((state) => state.history);
  const deleteHistoryItem = useFrameworkStore((state) => state.deleteHistoryItem);
  const [showSkeletons, setShowSkeletons] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeletons(false), 280);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageShell
      title="History"
      subtitle="Track all framework generations and access download links."
    >
      {showSkeletons ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <p className="text-sm text-muted">No generations yet. Create your first framework from Builder.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <Motion.article
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
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
                    Download ZIP
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
            </Motion.article>
          ))}
        </div>
      )}
    </PageShell>
  );
};

