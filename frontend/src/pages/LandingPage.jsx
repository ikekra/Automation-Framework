import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-white/60 bg-white/75 p-6 shadow-lg backdrop-blur sm:p-10"
      >
        <div className="inline-flex w-fit items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
          AI-Powered QA Framework Generator
        </div>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Build test automation frameworks with modern AI workflows.
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            AutoForge AI generates folder structures, starter files, and downloadable framework bundles in minutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/register" className="btn-primary">Start for free</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </motion.section>
    </main>
  );
};
