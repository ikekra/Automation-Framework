import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { useAuthStore } from "../store/authStore";

const statCards = [
  { label: "Frameworks shipped", value: "1.2K+", note: "starter kits and test bundles" },
  { label: "Execution coverage", value: "96%", note: "core workflow readiness" },
  { label: "Average setup time", value: "18 min", note: "from config to download" }
];

const capabilities = [
  {
    title: "Framework generation",
    description: "Build opinionated automation project scaffolds with runner, pattern, and CI choices in one flow."
  },
  {
    title: "Authenticated asset delivery",
    description: "Generated bundles stay attached to the account and are downloaded through controlled server access."
  },
  {
    title: "Web app diagnostics",
    description: "Run browser-level analysis with console, network, exception, screenshot, and AI explanation layers."
  }
];

const planProfiles = {
  starter: { title: "Starter", suites: 3, setupHours: 6, aiHours: 2, velocity: "Early-stage QA" },
  growth: { title: "Growth", suites: 8, setupHours: 18, aiHours: 6, velocity: "Scaling delivery" },
  enterprise: { title: "Enterprise", suites: 14, setupHours: 34, aiHours: 11, velocity: "Cross-team standardization" }
};

export const LandingPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [selectedPlan, setSelectedPlan] = useState("growth");

  const selectedProfile = planProfiles[selectedPlan];
  const savings = useMemo(
    () => Math.max(selectedProfile.setupHours - selectedProfile.aiHours, 0),
    [selectedProfile]
  );

  const primaryCtaTo = isAuthenticated ? "/dashboard" : "/register";
  const primaryCtaLabel = isAuthenticated ? "Open workspace" : "Start free workspace";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 md:py-10">
      <section className="mx-auto w-full max-w-7xl space-y-6">
        <GlassCard className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="bg-[linear-gradient(135deg,#081120,#12305f,#0f6a74)] px-6 py-8 text-white sm:px-8 sm:py-10">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
                SaaS QA platform
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                Operate automation like a product, not a folder of scripts.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
                AutoForge turns framework setup, diagnostics, and delivery into a polished commercial workspace with real account-backed history and controlled downloads.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={primaryCtaTo} className="btn-primary border-0 bg-white text-slate-950 hover:bg-slate-100">
                  {primaryCtaLabel}
                </Link>
                <Link to="/login" className="btn-secondary border-white/25 bg-white/10 text-white hover:bg-white/16">
                  Sign in
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {statCards.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/14 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-200">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(239,246,255,0.92))] p-6 dark:bg-[linear-gradient(180deg,rgba(8,17,32,0.96),rgba(11,24,45,0.92))] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-soft">Workspace Snapshot</p>

              <div className="mt-5 space-y-4">
                <div className="rounded-[26px] bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Active Module</p>
                      <p className="mt-2 text-lg font-bold">Framework Builder</p>
                    </div>
                    <span className="rounded-full bg-cyan-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-950">
                      Live
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/8 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Saved history</p>
                      <p className="mt-2 text-xl font-bold">Account-backed</p>
                    </div>
                    <div className="rounded-2xl bg-white/8 p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Delivery model</p>
                      <p className="mt-2 text-xl font-bold">Authenticated ZIP access</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/30 bg-white/75 p-5 dark:border-white/10 dark:bg-slate-900/50">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Commercial posture</p>
                  <ul className="mt-4 space-y-3 text-sm text-soft">
                    <li>Structured workspace shell with account context and product navigation</li>
                    <li>Framework builds tied to authenticated users</li>
                    <li>Operational diagnostics for internal QA and readiness checks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-soft">Core Modules</p>
            <div className="mt-5 space-y-3">
              {capabilities.map((item, index) => (
                <Motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[24px] border border-white/20 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/42"
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.description}</p>
                </Motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-soft">Commercial Fit</p>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-950 dark:text-slate-50">Model the workspace around your delivery stage</h2>
                <p className="mt-2 text-sm text-muted">
                  Switch between growth stages to estimate how much setup time the product can absorb for your team.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(planProfiles).map(([key, profile]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlan(key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selectedPlan === key
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "bg-white/72 text-slate-700 hover:bg-white dark:bg-slate-900/56 dark:text-slate-200 dark:hover:bg-slate-800/82"
                    }`}
                  >
                    {profile.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-card rounded-[24px] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Estimated suites</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-slate-50">{selectedProfile.suites}</p>
              </div>
              <div className="metric-card rounded-[24px] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Manual setup</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-slate-50">{selectedProfile.setupHours}h</p>
              </div>
              <div className="metric-card rounded-[24px] p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Product-assisted</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-950 dark:text-slate-50">{selectedProfile.aiHours}h</p>
              </div>
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/18 dark:bg-emerald-500/12">
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">Saved time</p>
                <p className="mt-2 text-2xl font-extrabold text-emerald-800 dark:text-emerald-100">{savings}h</p>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/20 bg-white/62 p-5 dark:border-white/10 dark:bg-slate-900/42">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Positioning</p>
              <p className="mt-2 text-base font-bold text-slate-900 dark:text-slate-100">{selectedProfile.velocity}</p>
              <p className="mt-2 text-sm text-muted">
                Use this profile when you want the product to feel like a real internal platform instead of a demo-only builder.
              </p>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.95fr,1.05fr]">
            <div className="bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(219,234,254,0.82),rgba(204,251,241,0.7))] px-6 py-8 dark:bg-[linear-gradient(135deg,rgba(8,17,32,0.96),rgba(10,25,45,0.9),rgba(7,41,48,0.84))] sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-soft">Why It Feels Different</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-slate-50">Less single-page demo, more operational product.</h2>
              <p className="mt-3 max-w-2xl text-sm text-muted">
                The app shell, navigation model, framework history, and account delivery flow are now designed to read like a commercial SaaS environment.
              </p>
            </div>
            <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
              <div className="flex flex-wrap gap-2">
                <Link to={primaryCtaTo} className="btn-primary border-0 bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                  {primaryCtaLabel}
                </Link>
                <Link to="/login" className="btn-secondary border-white/16 bg-white/8 text-white hover:bg-white/14">
                  Sign in
                </Link>
              </div>
              <p className="mt-5 text-sm text-slate-300">
                Best next step: keep evolving the authenticated app shell and unify product/auth experiences so the entire system feels like one polished platform.
              </p>
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
};
