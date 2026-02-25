import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassCard } from "../components/ui/GlassCard";
import { LazyBackgroundImage } from "../components/ui/LazyBackgroundImage";

const heroImage =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80";

export const LandingPage = () => {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 md:py-14">
      <section className="mx-auto w-full max-w-6xl space-y-5">
        <GlassCard className="relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <div className="absolute inset-0">
            <LazyBackgroundImage
              src={heroImage}
              alt="Modern technology workspace"
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/45" />
          </div>

          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10"
          >
            <div className="inline-flex w-fit items-center rounded-full border border-cyan-200/50 bg-cyan-50/70 px-3 py-1 text-xs font-semibold text-cyan-700 backdrop-blur">
              AI-Powered QA Framework Generator
            </div>

            <div className="mt-5 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                Build test automation frameworks with premium AI workflows.
              </h1>
              <p className="mt-4 text-base text-slate-100/90 sm:text-lg">
                AutoForge AI generates folder structures, starter files, and downloadable bundles in minutes.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link to="/register" className="btn-primary glow-hover">Start for free</Link>
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
      </section>
    </main>
  );
};

