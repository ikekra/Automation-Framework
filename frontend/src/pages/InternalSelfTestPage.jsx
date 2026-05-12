import { motion as Motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "../components/PageShell";
import { EmptyState } from "../components/ui/EmptyState";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext";
import { internalService } from "../services/api/internalService";

const statusTheme = {
  healthy: {
    dot: "bg-[color:var(--primary)]",
    card: "border-[color:var(--border-strong)] bg-[color:var(--primary-ink)] dark:border-[color:var(--border-strong)] dark:bg-[color:var(--primary-ink)]",
    text: "text-[color:var(--primary-deep)] dark:text-[color:var(--text-main)]"
  },
  degraded: {
    dot: "bg-[color:var(--accent)]",
    card: "border-[rgba(196,138,58,0.32)] bg-[rgba(244,227,198,0.72)] dark:border-[rgba(214,164,90,0.24)] dark:bg-[rgba(214,164,90,0.14)]",
    text: "text-[#8a5c1f] dark:text-[#f0d6ab]"
  },
  unhealthy: {
    dot: "bg-rose-500",
    card: "border-rose-300 bg-rose-50/80 dark:border-rose-700 dark:bg-rose-950/35",
    text: "text-rose-700 dark:text-rose-300"
  }
};

const StatusDot = ({ status }) => {
  const theme = statusTheme[status] || statusTheme.unhealthy;

  return (
    <Motion.span
      className={`inline-block h-2.5 w-2.5 rounded-full ${theme.dot}`}
      animate={{ scale: [1, 1.2, 1], opacity: [0.75, 1, 0.75] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export const InternalSelfTestPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const { pushToast } = useToast();

  const loadReport = useCallback(async () => {
    try {
      const data = await internalService.runSelfTest();
      setReport(data);
      setError("");
      setCountdown(30);
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to run self-test";
      setError(message);
      pushToast({ message, tone: "error" });
    } finally {
      setLoading(false);
    }
  }, [pushToast]);

  useEffect(() => {
    loadReport();

    const timer = setInterval(() => {
      loadReport();
    }, 30000);

    return () => clearInterval(timer);
  }, [loadReport]);

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const checks = useMemo(() => report?.checks || [], [report]);

  return (
    <PageShell
      title="Internal QA Self-Test"
      subtitle="Admin diagnostics for core platform dependencies and critical flows. Auto-refreshes every 30 seconds."
      action={
        <button type="button" className="btn-secondary" onClick={loadReport}>
          Refresh Now
        </button>
      }
    >
      {error ? <p className="rounded-xl bg-rose-100/80 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/35 dark:text-rose-200">{error}</p> : null}

      <GlassCard className="p-5">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-6 w-64" />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <StatusDot status={report?.overallStatus} />
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Overall Status: <span className={statusTheme[report?.overallStatus]?.text || "text-rose-700"}>{report?.overallStatus || "unknown"}</span>
            </p>
            <p className="text-sm text-muted">Last updated: {report?.timestamp ? new Date(report.timestamp).toLocaleString() : "n/a"}</p>
            <span className="text-xs text-muted">Auto-refresh in {countdown}s</span>
          </div>
        )}
      </GlassCard>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
      ) : checks.length === 0 ? (
        <EmptyState
          title="No diagnostic checks"
          description="No diagnostic checks returned. Try running the self-test again."
          action={(
            <button type="button" className="btn-primary" onClick={loadReport}>
              Run self-test
            </button>
          )}
          tone="warning"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {checks.map((check) => {
            const theme = statusTheme[check.status] || statusTheme.unhealthy;
            return (
              <Motion.div
                key={check.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-4 ${theme.card}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-slate-100">{check.name}</p>
                  <div className="flex items-center gap-2">
                    <StatusDot status={check.status} />
                    <span className={`text-xs font-semibold ${theme.text}`}>{check.status}</span>
                  </div>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-200">
                  {JSON.stringify(check.details || {}, null, 2)}
                </pre>
              </Motion.div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
};
