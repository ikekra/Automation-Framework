import { AnimatePresence, motion as Motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { PageShell } from "../components/PageShell";
import { EmptyState } from "../components/ui/EmptyState";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext";
import { testService } from "../services/api/testService";

const severityClassMap = {
  High: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
  Medium: "accent-badge",
  Low: "brand-badge"
};

const getEntrySeverity = (entry, kind) => {
  if (kind === "console" || kind === "exception") {
    return "High";
  }

  if (entry.failureText) {
    return "High";
  }

  if (entry.status >= 500) {
    return "High";
  }

  if (entry.status >= 400) {
    return "Medium";
  }

  return "Low";
};

const SeverityBadge = ({ level }) => (
  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${severityClassMap[level]}`}>
    {level}
  </span>
);

export const WebAppTesterPage = () => {
  const { pushToast } = useToast();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);
  const [error, setError] = useState("");
  const [currentReport, setCurrentReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [query, setQuery] = useState({ search: "", severity: "", page: 1, limit: 10 });
  const [aiExpanded, setAiExpanded] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const performanceSummary = useMemo(() => {
    if (!currentReport?.performanceMetrics) {
      return [];
    }

    const metrics = currentReport.performanceMetrics;
    return [
      ["DOM Ready", metrics.domContentLoadedMs],
      ["Load Event", metrics.loadEventMs],
      ["Response End", metrics.responseEndMs],
      ["Transfer Size", metrics.transferSize]
    ];
  }, [currentReport]);

  const loadReports = useCallback(async (nextQuery = query) => {
    try {
      setLoadingReports(true);
      const data = await testService.listReports(nextQuery);
      const items = data.items || [];
      const nextMeta = data.meta || { page: 1, limit: nextQuery.limit, total: items.length, totalPages: 1 };

      setReports(items);
      setMeta(nextMeta);
      setCurrentReport((prev) => {
        if (!prev) {
          return items[0] || null;
        }

        const prevId = prev._id || prev.id;
        return items.find((item) => (item._id || item.id) === prevId) || items[0] || null;
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoadingReports(false);
    }
  }, [query]);

  useEffect(() => {
    loadReports(query);
  }, [query, loadReports]);

  const onAnalyze = async (event) => {
    event.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please provide a valid URL");
      return;
    }

    try {
      setLoading(true);
      const report = await testService.analyze(url.trim());
      setCurrentReport(report);
      setUrl("");
      setQuery((prev) => ({ ...prev, page: 1 }));
      pushToast({ message: "Analysis complete. Report generated.", tone: "success" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to analyze target URL");
      pushToast({ message: err?.response?.data?.message || "Failed to analyze target URL", tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onCopyFixCode = async (code, index) => {
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 1500);
    } catch {
      setError("Unable to copy code snippet");
    }
  };

  return (
    <PageShell
      title="Web App Tester"
      subtitle="Analyze a web app URL for console errors, network failures, JS exceptions, and performance timing."
    >
      <LoadingOverlay
        visible={loading}
        title="Analyzing web app"
        subtitle="Capturing logs, failures, exceptions, screenshot, and performance metrics..."
      />

      <GlassCard className="p-5">
        <form onSubmit={onAnalyze} className="flex flex-col gap-3 md:flex-row">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="input"
            type="url"
            placeholder="https://example.com"
            required
          />
          <Motion.button whileTap={{ scale: 0.98 }} type="submit" className="btn-primary glow-hover md:w-52" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Motion.button>
        </form>
        {error ? <p className="mt-3 rounded-xl bg-rose-100/75 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Previous Reports</h2>

          <div className="mt-3 space-y-2">
            <input
              className="input"
              placeholder="Search URL"
              value={query.search}
              onChange={(event) => setQuery((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
            />
            <select
              className="input"
              value={query.severity}
              onChange={(event) => setQuery((prev) => ({ ...prev, severity: event.target.value, page: 1 }))}
            >
              <option value="">All Severities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {loadingReports ? (
            <div className="mt-4 space-y-3">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No reports yet"
                description="Run your first analysis to populate results. Tip: start with your staging URL."
              />
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {reports.map((report) => {
                const reportId = report._id || report.id;
                const activeId = currentReport?._id || currentReport?.id;
                const active = activeId === reportId;

                return (
                  <button
                    key={reportId}
                    type="button"
                    onClick={() => setCurrentReport(report)}
                    className={`w-full rounded-xl border p-3 text-left text-xs ${
                      active
                        ? "border-[color:var(--border-strong)] bg-[color:var(--primary-ink)] dark:border-[color:var(--border-strong)] dark:bg-[color:var(--primary-ink)]"
                        : "border-white/20 bg-white/35 dark:border-white/10 dark:bg-slate-900/35"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <SeverityBadge level={report.severitySummary?.overallSeverity || "Low"} />
                      <span className="text-muted">{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{report.url}</p>
                    <p className="mt-1 text-muted">{new Date(report.createdAt).toLocaleTimeString()}</p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>Page {meta.page} / {meta.totalPages}</span>
            <span>{meta.total} total</span>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="btn-secondary w-full"
              disabled={meta.page <= 1 || loadingReports}
              onClick={() => setQuery((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn-secondary w-full"
              disabled={meta.page >= meta.totalPages || loadingReports}
              onClick={() => setQuery((prev) => ({ ...prev, page: Math.min(meta.totalPages, prev.page + 1) }))}
            >
              Next
            </button>
          </div>
        </GlassCard>

        <AnimatePresence mode="wait">
          <Motion.div
            key={currentReport?._id || currentReport?.id || "empty"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {!currentReport ? (
              <EmptyState
                title="No analysis selected"
                description="Run an analysis to view a structured report."
                action={(
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      if (!url) {
                        setUrl("https://");
                      }
                    }}
                  >
                    Start new analysis
                  </button>
                )}
              />
            ) : (
              <>
                <GlassCard className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Severity Summary</h3>
                    <SeverityBadge level={currentReport.severitySummary?.overallSeverity || "Low"} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                      <p className="text-xs text-muted">High</p>
                      <p className="mt-1 text-lg font-semibold text-rose-600 dark:text-rose-300">{currentReport.severitySummary?.highCount || 0}</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                      <p className="text-xs text-muted">Medium</p>
                      <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-300">{currentReport.severitySummary?.mediumCount || 0}</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                      <p className="text-xs text-muted">Low</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-300">{currentReport.severitySummary?.lowCount || 0}</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                      <p className="text-xs text-muted">Score</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{currentReport.severitySummary?.score || 0}</p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => setAiExpanded((prev) => !prev)}
                  >
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">AI Explanation</h3>
                    <span className="text-xs text-muted">{aiExpanded ? "Collapse" : "Expand"}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {aiExpanded ? (
                      <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-3">
                          <div className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs text-muted">Root Cause</p>
                              <SeverityBadge level={currentReport.aiAnalysis?.severity || currentReport.severitySummary?.overallSeverity || "Low"} />
                            </div>
                            <p className="text-sm text-slate-900 dark:text-slate-100">
                              {currentReport.aiAnalysis?.rootCause || "AI explanation is unavailable for this report."}
                            </p>
                          </div>

                          {(currentReport.aiAnalysis?.suggestedFixes || []).map((fix, index) => (
                            <div key={`${fix.title}-${index}`} className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fix.title}</p>
                              <p className="mt-1 text-sm text-muted">{fix.explanation}</p>
                              {fix.codeSnippet ? (
                                <>
                                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/90 p-3 text-xs text-slate-100">
                                    <code>{fix.codeSnippet}</code>
                                  </pre>
                                  <button
                                    type="button"
                                    onClick={() => onCopyFixCode(fix.codeSnippet, index)}
                                    className="btn-secondary mt-2"
                                  >
                                    {copiedIndex === index ? "Copied" : "Copy Fix Code"}
                                  </button>
                                </>
                              ) : null}
                            </div>
                          ))}

                          {(currentReport.aiAnalysis?.bestPractices || []).length > 0 ? (
                            <div className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Best Practices</p>
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                                {currentReport.aiAnalysis.bestPractices.map((practice, index) => (
                                  <li key={`${practice.slice(0, 20)}-${index}`}>{practice}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </Motion.div>
                    ) : null}
                  </AnimatePresence>
                </GlassCard>

                <GlassCard className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Performance Summary</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {performanceSummary.map(([label, value]) => (
                      <div key={label} className="rounded-xl border border-white/20 bg-white/35 p-3 dark:border-white/10 dark:bg-slate-900/35">
                        <p className="text-xs text-muted">{label}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {value === null || value === undefined ? "n/a" : `${value}${label.includes("Size") ? " bytes" : " ms"}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Console Errors</h3>
                  <div className="mt-3 space-y-3">
                    {(currentReport.consoleErrors || []).length === 0 ? (
                      <p className="text-sm text-muted">No console errors found.</p>
                    ) : (
                      (currentReport.consoleErrors || []).map((entry, index) => {
                        const level = getEntrySeverity(entry, "console");
                        return (
                        <div
                          key={`${entry.text}-${index}`}
                          className={`rounded-xl border p-3 ${
                            level === "High"
                              ? "border-rose-300 bg-rose-50/80 dark:border-rose-700 dark:bg-rose-950/35"
                              : "border-white/20 bg-white/35 dark:border-white/10 dark:bg-slate-900/35"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <SeverityBadge level={level} />
                            <span className="text-xs text-muted">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-slate-900 dark:text-slate-100">{entry.text}</p>
                        </div>
                      );
                    })
                    )}
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Network Errors</h3>
                  <div className="mt-3 space-y-3">
                    {(currentReport.networkErrors || []).length === 0 ? (
                      <p className="text-sm text-muted">No failed requests found.</p>
                    ) : (
                      (currentReport.networkErrors || []).map((entry, index) => {
                        const level = getEntrySeverity(entry, "network");
                        return (
                        <div
                          key={`${entry.url}-${index}`}
                          className={`rounded-xl border p-3 ${
                            level === "High"
                              ? "border-rose-300 bg-rose-50/80 dark:border-rose-700 dark:bg-rose-950/35"
                              : "border-white/20 bg-white/35 dark:border-white/10 dark:bg-slate-900/35"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <SeverityBadge level={level} />
                            <span className="text-xs text-muted">{entry.method} {entry.status || "-"}</span>
                          </div>
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{entry.url}</p>
                          <p className="mt-1 text-xs text-muted">{entry.failureText || entry.statusText || "HTTP error"}</p>
                        </div>
                      );
                    })
                    )}
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">JS Exceptions</h3>
                  <div className="mt-3 space-y-3">
                    {(currentReport.jsExceptions || []).length === 0 ? (
                      <p className="text-sm text-muted">No uncaught exceptions found.</p>
                    ) : (
                      (currentReport.jsExceptions || []).map((entry, index) => {
                        const level = getEntrySeverity(entry, "exception");
                        return (
                        <div
                          key={`${entry.message}-${index}`}
                          className={`rounded-xl border p-3 ${
                            level === "High"
                              ? "border-rose-300 bg-rose-50/80 dark:border-rose-700 dark:bg-rose-950/35"
                              : "border-white/20 bg-white/35 dark:border-white/10 dark:bg-slate-900/35"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <SeverityBadge level={level} />
                            <span className="text-xs text-muted">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-slate-900 dark:text-slate-100">{entry.message}</p>
                        </div>
                      );
                    })
                    )}
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Screenshot Preview</h3>
                  {currentReport.screenshotUrl ? (
                    <img
                      src={currentReport.screenshotUrl}
                      alt="Captured page screenshot"
                      loading="lazy"
                      decoding="async"
                      className="mt-3 w-full rounded-2xl border border-white/20"
                    />
                  ) : (
                    <p className="mt-3 text-sm text-muted">Screenshot not available.</p>
                  )}
                </GlassCard>
              </>
            )}
          </Motion.div>
        </AnimatePresence>
      </div>
    </PageShell>
  );
};
