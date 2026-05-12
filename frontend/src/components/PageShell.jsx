import { motion as Motion } from "framer-motion";

export const PageShell = ({ title, subtitle, children, action, eyebrow = "Workspace" }) => {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="overflow-hidden rounded-[30px] border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(239,246,255,0.72),rgba(220,252,231,0.62))] p-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(8,17,32,0.92),rgba(15,23,42,0.88),rgba(9,54,62,0.82))]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-soft">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
              {title}
            </h1>
            {subtitle ? <p className="mt-3 text-sm text-soft sm:text-base">{subtitle}</p> : null}
          </div>

          {action ? (
            <div className="rounded-[22px] border border-white/35 bg-white/72 p-1.5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-slate-950/30">
              {action}
            </div>
          ) : null}
        </div>
      </div>

      {children}
    </Motion.section>
  );
};
