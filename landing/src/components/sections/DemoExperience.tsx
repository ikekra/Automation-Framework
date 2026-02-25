"use client";

import { motion as Motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Eye, Gauge, TerminalSquare } from "lucide-react";
import { useEffect, useMemo, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Phase = "idle" | "scanning" | "complete";

type DemoState = {
  url: string;
  phase: Phase;
  progress: number;
};

type DemoAction =
  | { type: "setUrl"; payload: string }
  | { type: "start" }
  | { type: "tick"; payload: number }
  | { type: "complete" }
  | { type: "reset" };

const initialState: DemoState = {
  url: "example.com",
  phase: "idle",
  progress: 0
};

const reducer = (state: DemoState, action: DemoAction): DemoState => {
  switch (action.type) {
    case "setUrl":
      return { ...state, url: action.payload };
    case "start":
      return { ...state, phase: "scanning", progress: 0 };
    case "tick":
      return { ...state, progress: Math.min(100, action.payload) };
    case "complete":
      return { ...state, phase: "complete", progress: 100 };
    case "reset":
      return { ...initialState, url: state.url || "example.com" };
    default:
      return state;
  }
};

const fakeResult = {
  summary: {
    consoleErrors: 3,
    performanceWarnings: 2,
    accessibilityIssues: 1
  },
  details: [
    { type: "Console Error", text: "Uncaught TypeError in checkout.bundle.js:412", severity: "Critical", icon: TerminalSquare },
    { type: "Console Error", text: "Failed to fetch /api/inventory (500)", severity: "Critical", icon: TerminalSquare },
    { type: "Console Error", text: "Unhandled promise rejection in payment flow", severity: "Critical", icon: TerminalSquare },
    { type: "Performance", text: "Largest Contentful Paint: 3.7s on /pricing", severity: "Warning", icon: Gauge },
    { type: "Performance", text: "Main-thread blocking task > 420ms", severity: "Warning", icon: Gauge },
    { type: "Accessibility", text: "Missing form label on newsletter input", severity: "Issue", icon: Eye }
  ]
};

const statusStyles: Record<string, string> = {
  Critical: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
  Warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  Issue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
};

export const DemoExperience = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.phase !== "scanning") {
      return;
    }

    let progress = 0;
    const timer = window.setInterval(() => {
      progress += Math.floor(Math.random() * 9) + 6;
      dispatch({ type: "tick", payload: progress });

      if (progress >= 100) {
        window.clearInterval(timer);
      }
    }, 280);

    const done = window.setTimeout(() => {
      dispatch({ type: "complete" });
    }, 4200);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(done);
    };
  }, [state.phase]);

  const scanningMessages = useMemo(
    () => [
      "Launching browser context...",
      "Collecting console diagnostics...",
      "Measuring performance metrics...",
      "Analyzing accessibility violations...",
      "Compiling report output..."
    ],
    []
  );

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={state.url}
            onChange={(event) => dispatch({ type: "setUrl", payload: event.target.value })}
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="example.com"
            aria-label="Demo URL"
            disabled={state.phase === "scanning"}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => dispatch({ type: "start" })}
              disabled={state.phase === "scanning" || !state.url.trim()}
            >
              {state.phase === "scanning" ? "Scanning..." : "Run Demo Scan"}
            </Button>
            <Button variant="secondary" onClick={() => dispatch({ type: "reset" })}>
              Reset
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {state.phase === "scanning" ? (
            <Motion.div
              key="scan"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-6 space-y-4"
            >
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Scanning {state.url}</span>
                  <span>{state.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
                  <Motion.div
                    className="h-full bg-blue-600"
                    animate={{ width: `${state.progress}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {scanningMessages.map((message, index) => (
                  <div key={message} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
                    <Skeleton className="mt-2 h-2 w-full" />
                    <Skeleton className="mt-1 h-2 w-3/4" />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Task {index + 1}/5</p>
                  </div>
                ))}
              </div>
            </Motion.div>
          ) : null}

          {state.phase === "complete" ? (
            <Motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-6 space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Console Errors</p>
                  <p className="mt-2 text-2xl font-semibold text-rose-600 dark:text-rose-300">{fakeResult.summary.consoleErrors}</p>
                </div>
                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Performance Warnings</p>
                  <p className="mt-2 text-2xl font-semibold text-amber-600 dark:text-amber-300">{fakeResult.summary.performanceWarnings}</p>
                </div>
                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Accessibility Issues</p>
                  <p className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-300">{fakeResult.summary.accessibilityIssues}</p>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Simulated Test Report</p>
                  <span className="inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Scan complete
                  </span>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {fakeResult.details.map((item) => (
                    <div key={item.text} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <div className="flex items-start gap-3">
                        <item.icon className="mt-0.5 h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.type}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
                        </div>
                      </div>

                      <span className={`inline-flex w-fit items-center gap-2 rounded-md border px-2 py-1 text-xs font-semibold ${statusStyles[item.severity]}`}>
                        <Motion.span
                          className={`h-1.5 w-1.5 rounded-full ${item.severity === "Critical" ? "bg-rose-500" : item.severity === "Warning" ? "bg-amber-500" : "bg-blue-500"}`}
                          animate={{ opacity: [0.45, 1, 0.45] }}
                          transition={{ duration: 1.3, repeat: Infinity }}
                        />
                        {item.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Motion.div>
          ) : null}

          {state.phase === "idle" ? (
            <Motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Run the demo scan to experience a realistic AutoForge test workflow.</span>
              </div>
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </Card>
    </section>
  );
};
