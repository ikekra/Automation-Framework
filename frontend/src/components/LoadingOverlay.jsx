import { AnimatePresence, motion as Motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";

export const LoadingOverlay = ({ visible, title = "Generating with AI", subtitle = "Building your framework files and structure..." }) => {
  return (
    <AnimatePresence>
      {visible ? (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 backdrop-blur-sm"
        >
          <GlassCard
            className="w-[92%] max-w-md p-6"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
          >
            <div className="flex items-center gap-4">
              <Motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-11 w-11 rounded-full border-4 border-indigo-200/50 border-t-cyan-500"
              />
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                <p className="text-sm text-muted">{subtitle}</p>
              </div>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-200/45 dark:bg-slate-800/60">
              <Motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.25, ease: "easeInOut" }}
              />
            </div>
          </GlassCard>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  );
};

