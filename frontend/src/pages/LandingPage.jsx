import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { GlassCard } from "../components/ui/GlassCard";
import { LazyBackgroundImage } from "../components/ui/LazyBackgroundImage";
import { useAuthStore } from "../store/authStore";

const heroImage =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80";

const planProfiles = {
  starter: { title: "Starter", suites: 3, setupHours: 6, aiHours: 2 },
  growth: { title: "Growth", suites: 8, setupHours: 18, aiHours: 6 },
  enterprise: { title: "Enterprise", suites: 14, setupHours: 34, aiHours: 11 }
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
  const primaryCtaLabel = isAuthenticated ? "Go to dashboard" : "Start building";

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 md:py-14">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <GlassCard className="relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <div className="absolute inset-0">
            <LazyBackgroundImage
              src={heroImage}
              alt="Modern technology workspace"
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/55" />
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10"
          >
            <div className="inline-flex w-fit items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              Commercial-grade QA automation
            </div>

            <div className="mt-5 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Ship automation frameworks with clarity and speed.
              </h1>
              <p className="mt-4 text-base text-slate-100/90 sm:text-lg">
                AutoForge AI generates reliable test scaffolding, runner configs, and ready-to-download bundles.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link to={primaryCtaTo} className="btn-primary glow-hover">{primaryCtaLabel}</Link>
              </Motion.div>
              <Motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link to="/login" className="btn-secondary bg-white/85">Login</Link>
              </Motion.div>
            </div>
          </Motion.div>
        </GlassCard>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Faster Setup", "Generate starter frameworks and conventions instantly."],
            ["Team Consistency", "Use repeatable patterns across test suites and pipelines."],
            ["Ready to Ship", "Get downloadable files for local use in seconds."]
          ].map(([title, text], index) => (
            <GlassCard
              key={title}
              hover
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="p-5"
            >
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </GlassCard>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">How it works</h2>
            <div className="mt-4 space-y-3">
              {[
                ["Pick your stack", "Choose language, runner, and patterns."],
                ["Generate with AI", "Receive folders, files, and workflows."],
                ["Download and run", "Get a ZIP and start testing immediately."]
              ].map(([title, text], index) => (
                <div key={title} className="rounded-2xl border border-white/20 bg-white/40 p-4 dark:border-white/10 dark:bg-slate-900/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Step {index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Security & Control</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
              <li>Email verification and OTP login.</li>
              <li>Two-factor authentication for added security.</li>
              <li>Rate-limited API access and audit-friendly logs.</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">SOC-ready patterns</span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">SSRF-safe analyzer</span>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">Tokenized downloads</span>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Framework effort estimator</h2>
              <p className="mt-1 text-sm text-muted">
                Pick a project profile to estimate setup effort and expected hours saved with AI-assisted generation.
              </p>
            </div>
            <div className="flex gap-2">
              {Object.entries(planProfiles).map(([key, profile]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPlan(key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    selectedPlan === key
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white/70 text-slate-700 hover:bg-white dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/80"
                  }`}
                >
                  {profile.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/50 p-4 dark:border-white/10 dark:bg-slate-900/40">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Estimated suites</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedProfile.suites}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/50 p-4 dark:border-white/10 dark:bg-slate-900/40">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Manual setup</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedProfile.setupHours}h</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-100/60 p-4 dark:border-emerald-300/20 dark:bg-emerald-900/20">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-200">Potential savings</p>
              <p className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-100">{savings}h</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ready to build your next framework?</h2>
              <p className="mt-1 text-sm text-muted">Create an account in minutes and ship faster QA foundations.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={primaryCtaTo} className="btn-primary">{primaryCtaLabel}</Link>
              <Link to="/login" className="btn-secondary">Sign in</Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </main>
  );
};
