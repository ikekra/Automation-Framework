"use client";

import dynamic from "next/dynamic";
import { motion as Motion } from "framer-motion";
import { Activity, BarChart3, LayoutDashboard, Settings, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PerformanceTrendChart = dynamic(
  () => import("@/components/sections/PerformanceTrendChart").then((mod) => mod.PerformanceTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-[320px] w-full animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/50" />
  }
);

const performanceData = [
  { name: "Mon", score: 89 },
  { name: "Tue", score: 86 },
  { name: "Wed", score: 91 },
  { name: "Thu", score: 84 },
  { name: "Fri", score: 92 },
  { name: "Sat", score: 94 },
  { name: "Sun", score: 93 }
];

const errorRows = [
  { service: "Checkout API", type: "Unhandled Exception", severity: "Critical", updated: "2m ago" },
  { service: "Auth Gateway", type: "Latency Spike", severity: "Warning", updated: "9m ago" },
  { service: "Billing Worker", type: "Queue Saturation", severity: "Warning", updated: "14m ago" },
  { service: "Search Indexer", type: "Failed Job", severity: "Resolved", updated: "28m ago" }
] as const;

const navItems = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: ShieldAlert, label: "Incidents" },
  { icon: Activity, label: "Monitors" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" }
] as const;

const useCounter = (target: number) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const steps = 26;
    const step = target / steps;
    const timer = window.setInterval(() => {
      current += 1;
      setValue((prev) => (current >= steps ? target : Math.round(prev + step)));
      if (current >= steps) {
        window.clearInterval(timer);
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [target]);

  return value;
};

const statusStyles: Record<string, string> = {
  Critical: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300",
  Warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
};

const statusPulse: Record<string, string> = {
  Critical: "bg-rose-500",
  Warning: "bg-amber-500",
  Resolved: "bg-emerald-500"
};

export const DashboardPreviewSection = () => {
  const activeChecks = useCounter(37);
  const criticalAlerts = useCounter(3);
  const healthScore = useCounter(93);

  const metrics = useMemo(
    () => [
      { label: "Active Checks", value: activeChecks },
      { label: "Critical Alerts", value: criticalAlerts },
      { label: "Health Score", value: `${healthScore}%` }
    ],
    [activeChecks, criticalAlerts, healthScore]
  );

  return (
    <AnimatedSection id="dashboard-preview" className="px-4 py-24 sm:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Dashboard Preview</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">Operational visibility built for engineering teams</h2>
          <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            A realistic control center showing active checks, issue triage, and performance trends for production web applications.
          </p>
        </header>

        <Motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-[240px_1fr]">
            <aside className="border-b border-slate-200 bg-slate-50 px-4 py-5 dark:border-slate-800 dark:bg-slate-950 lg:border-b-0 lg:border-r">
              <p className="mb-6 text-sm font-semibold text-slate-900 dark:text-slate-100">AutoForge Console</p>
              <nav aria-label="Dashboard navigation" className="space-y-1">
                {navItems.map((item) => (
                  <button key={item.label} type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            <div className="flex flex-col">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Production Health</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Updated just now</p>
                </div>
                <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">Live Environment</Badge>
              </header>

              <main className="grid flex-1 grid-cols-1 gap-5 p-5 xl:grid-cols-[1.2fr_1fr]">
                <div className="space-y-5">
                  <Card className="p-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {metrics.map((metric) => (
                        <div key={metric.label} className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{metric.label}</p>
                          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Error List</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Last 30 minutes</p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {errorRows.map((row) => (
                          <TableRow key={`${row.service}-${row.type}`}>
                            <TableCell className="font-medium text-slate-900 dark:text-slate-100">{row.service}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-semibold ${statusStyles[row.severity]}`}>
                                <Motion.span
                                  className={`h-1.5 w-1.5 rounded-full ${statusPulse[row.severity]}`}
                                  animate={{ opacity: [0.4, 1, 0.4] }}
                                  transition={{ duration: 1.4, repeat: Infinity }}
                                />
                                {row.severity}
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-500 dark:text-slate-400">{row.updated}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>

                <Card className="p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    Performance Trend
                  </div>
                  <div className="h-[320px] w-full">
                    <PerformanceTrendChart data={performanceData} />
                  </div>
                </Card>
              </main>
            </div>
          </div>
        </Motion.article>
      </div>
    </AnimatedSection>
  );
};
