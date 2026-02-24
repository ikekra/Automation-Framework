import { AnimatePresence, motion } from "framer-motion";

export const LoadingOverlay = ({ visible, title = "Generating with AI", subtitle = "Building your framework files and structure..." }) => {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="card w-[92%] max-w-md p-6"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                className="h-11 w-11 rounded-full border-4 border-indigo-200 border-t-cyan-500"
              />
              <div>
                <p className="text-lg font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-600">{subtitle}</p>
              </div>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
