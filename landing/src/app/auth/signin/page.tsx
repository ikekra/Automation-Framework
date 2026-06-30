import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";

export default async function SignInPage() {
  const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

  return (
    <div className="min-h-screen surface-gradient">
      <Navbar />
      <main className="px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <Card className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Product Access
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Continue in the main AutoForge app
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              The marketing site stays public, but the real workspace now lives in the main product app. Use the app
              login or registration flow to access framework generation, history, and diagnostics.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`${appUrl}/login`}
                className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Open app login
              </Link>
              <Link
                href={`${appUrl}/register`}
                className="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Create account
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
