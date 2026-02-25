import { motion as Motion } from "framer-motion";

export const GlassCard = ({ className = "", hover = false, children, ...props }) => {
  const classes = ["glass-card", className].filter(Boolean).join(" ");

  return (
    <Motion.div
      className={classes}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: "0 20px 45px -26px rgba(56, 189, 248, 0.5)"
            }
          : undefined
      }
      transition={{ duration: 0.25, ease: "easeOut" }}
      {...props}
    >
      {children}
    </Motion.div>
  );
};
