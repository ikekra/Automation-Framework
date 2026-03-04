import { motion as Motion } from "framer-motion";

export const EmptyState = ({ title, description, action, tone = "default" }) => {
  const toneStyles =
    tone === "warning"
      ? "border-amber-200 bg-amber-50/60 text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200"
      : "border-white/20 bg-white/40 text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`rounded-2xl border p-6 text-center ${toneStyles}`}
    >
      <Motion.div
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/70 text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l3 6 6 .9-4.3 4.2 1 6-5.7-3-5.7 3 1-6L3 9.9 9 9l3-6z" />
        </svg>
      </Motion.div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </Motion.div>
  );
};
