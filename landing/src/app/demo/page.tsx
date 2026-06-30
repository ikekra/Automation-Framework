import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DemoExperience } from "@/components/sections/DemoExperience";
import { Navbar } from "@/components/Navbar";

export default function DemoPage() {
  return (
    <div className="min-h-screen surface-gradient">
      <Navbar />
      <main className="px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Landing
          </Link>

          <header className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--dim-foreground)]">Interactive Demo</p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">
              Preview the runtime analysis experience
            </h1>
            <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              This simulation shows how AutoForge presents URL-based scanning, progress tracking, and actionable results
              inside a more commercial-style QA workflow.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--dim-foreground)]">Scan mode</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Browser-driven analysis</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--dim-foreground)]">Output</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Issues, traces, screenshots</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--dim-foreground)]">Goal</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">Faster triage and handoff</p>
              </div>
            </div>
          </header>

          <DemoExperience />
        </div>
      </main>
    </div>
  );
}
