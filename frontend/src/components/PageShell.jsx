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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p> : null}
        </div>
        {action ? <div className="rounded-2xl border border-white/30 bg-white/60 p-1 dark:border-white/10 dark:bg-slate-900/50">{action}</div> : null}
      </div>
      {children}
    </Motion.section>
  );
};

