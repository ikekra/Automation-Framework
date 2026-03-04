import { motion as Motion } from "framer-motion";

export const AppBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Motion.div
        className="bg-aurora"
        animate={{ opacity: [0.75, 0.95, 0.8], scale: [1, 1.03, 1] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="bg-grid" />
      <div className="bg-noise" />

      <Motion.div
        className="bg-orbit"
        animate={{ rotate: [0, 8, 0] }}
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />

      <Motion.div
        className="bg-panel bg-panel-a"
        animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      />
      <Motion.div
        className="bg-panel bg-panel-b"
        animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      />
      <Motion.div
        className="bg-panel bg-panel-c"
        animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
};
