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
              boxShadow: "0 24px 48px -28px rgba(15, 122, 107, 0.45)"
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
