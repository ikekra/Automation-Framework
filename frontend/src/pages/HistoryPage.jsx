import { motion as Motion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { EmptyState } from "../components/ui/EmptyState";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext";
import { useFrameworkStore } from "../store/frameworkStore";

export const HistoryPage = () => {
  const history = useFrameworkStore((state) => state.history);
  const meta = useFrameworkStore((state) => state.meta);
  const loading = useFrameworkStore((state) => state.loading);
  const fetchHistory = useFrameworkStore((state) => state.fetchHistory);
  const deleteHistoryItem = useFrameworkStore((state) => state.deleteHistoryItem);
  const downloadHistoryItem = useFrameworkStore((state) => state.downloadHistoryItem);
  const bootstrapped = useFrameworkStore((state) => state.bootstrapped);
  const { pushToast } = useToast();

  useEffect(() => {
    if (!bootstrapped) {
      fetchHistory({ page: 1, limit: 10 }).catch((error) => {
        pushToast({ message: error?.response?.data?.message || "Failed to load framework history.", tone: "error" });
      });
    }
  }, [bootstrapped, fetchHistory, pushToast]);

  return (
    <PageShell
      title="Framework History"
      subtitle="Every generated framework saved to your account, with authenticated downloads and cleanup controls."
      eyebrow="Library"
      action={(
        <button
          type="button"
          onClick={() => {
            fetchHistory({ page: meta.page, limit: meta.limit }).catch((error) => {
              pushToast({ message: error?.response?.data?.message || "Failed to refresh history.", tone: "error" });
            });
          }}
          className="btn-secondary"
        >
          Refresh
        </button>
      )}
    >
      <GlassCard className="overflow-hidden p-0">
        <div className="brand-gradient-panel grid gap-4 px-5 py-6 text-white md:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/72">Account-Backed</p>
            <h2 className="mt-3 text-2xl font-bold">This history now comes from the backend, not local browser state.</h2>
            <p className="mt-2 text-sm text-slate-200">
              Your generated framework records are tied to your signed-in account, so downloads and cleanup stay consistent across sessions.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Saved Builds</p>
              <p className="mt-2 text-2xl font-bold">{meta.total}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Current Page</p>
              <p className="mt-2 text-2xl font-bold">{meta.page}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-200">Per Page</p>
              <p className="mt-2 text-2xl font-bold">{meta.limit}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {loading && history.length === 0 ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-28 w-full" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <EmptyState
          title="No framework history yet"
          description="Generate your first framework and it will be saved here automatically."
          action={(
            <Link to="/framework-builder" className="btn-primary">
              Build framework
            </Link>
          )}
        />
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <Motion.article
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass-card overflow-hidden p-0"
            >
              <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr,0.9fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="brand-badge rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {item.language}
                    </span>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {item.automationTool}
                    </span>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {item.testRunner}
                    </span>
                  </div>

                  <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {item.pattern} workflow with {item.cicd}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Created {new Date(item.createdAt).toLocaleString()} | Download token expires at{" "}
                    {item.download?.expiresAt ? new Date(item.download.expiresAt).toLocaleString() : "n/a"}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-slate-900/45">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">Files</p>
                      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{item.filesCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-slate-900/45">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">Folders</p>
                      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{item.folderCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/55 p-4 dark:border-white/10 dark:bg-slate-900/45">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">Docker</p>
                      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{item.dockerSupport ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>

                <div className="brand-gradient-panel flex flex-col justify-between rounded-[28px] p-5 text-white">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">Actions</p>
                    <p className="mt-3 text-sm text-slate-200">
                      Download the generated bundle through the authenticated API or remove the record from your account history.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        downloadHistoryItem(item).catch((error) => {
                          pushToast({ message: error?.response?.data?.message || error?.message || "Download failed.", tone: "error" });
                        });
                      }}
                      className="btn-primary border-0 bg-white text-[color:var(--primary-deep)] hover:bg-[color:var(--accent-soft)]"
                    >
                      Download ZIP
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
                      className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/15"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Motion.article>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-sm text-muted dark:border-white/10 dark:bg-slate-900/45">
        <span>Page {meta.page} of {meta.totalPages}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary"
            disabled={meta.page <= 1 || loading}
            onClick={() => {
              fetchHistory({ page: Math.max(1, meta.page - 1), limit: meta.limit }).catch((error) => {
                pushToast({ message: error?.response?.data?.message || "Failed to load previous page.", tone: "error" });
              });
            }}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={meta.page >= meta.totalPages || loading}
            onClick={() => {
              fetchHistory({ page: Math.min(meta.totalPages, meta.page + 1), limit: meta.limit }).catch((error) => {
                pushToast({ message: error?.response?.data?.message || "Failed to load next page.", tone: "error" });
              });
            }}
          >
            Next
          </button>
        </div>
      </div>
    </PageShell>
  );
};
