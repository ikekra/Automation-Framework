import { motion as Motion } from "framer-motion";

export const AppBackground = () => {
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Motion.div
        className="bg-aurora"
        animate={reduceMotion ? false : { opacity: [0.82, 1, 0.88], scale: [1, 1.04, 1] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 16, ease: "easeInOut", repeat: Infinity }}
      />

      <div className="bg-grid" />
      <div className="bg-noise" />

      <Motion.div
        className="bg-orbit"
        animate={reduceMotion ? false : { rotate: [0, 6, 0], x: [0, 8, 0] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 20, ease: "easeInOut", repeat: Infinity }}
      />

      <Motion.div
        className="bg-panel bg-panel-a"
        animate={reduceMotion ? false : { y: [0, -14, 0], x: [0, 6, 0] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 12, ease: "easeInOut", repeat: Infinity }}
      />
      <Motion.div
        className="bg-panel bg-panel-b"
        animate={reduceMotion ? false : { y: [0, 12, 0], x: [0, -7, 0] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 14, ease: "easeInOut", repeat: Infinity }}
      />
      <Motion.div
        className="bg-panel bg-panel-c"
        animate={reduceMotion ? false : { y: [0, 10, 0], x: [0, -4, 0] }}
        transition={reduceMotion ? { duration: 0 } : { duration: 11, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
};
