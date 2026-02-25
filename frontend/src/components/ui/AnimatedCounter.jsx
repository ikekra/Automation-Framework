import { motion as Motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export const AnimatedCounter = ({ value, prefix = "", suffix = "", className = "", decimals = 0 }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: "easeOut"
    });

    return () => controls.stop();
  }, [count, value]);

  return (
    <Motion.span className={className}>
      {prefix}
      <Motion.span>{rounded}</Motion.span>
      {suffix}
    </Motion.span>
  );
};

