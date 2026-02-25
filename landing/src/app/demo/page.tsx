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
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Landing
          </Link>

          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Interactive Demo</p>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">Try a realistic AutoForge scan workflow</h1>
            <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-300">
              This simulation demonstrates how URL-based scanning, progress tracking, and actionable results appear in the platform.
            </p>
          </header>

          <DemoExperience />
        </div>
      </main>
    </div>
  );
}
