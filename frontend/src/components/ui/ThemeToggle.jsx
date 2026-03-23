import { motion as Motion } from "framer-motion";
import { useThemeStore } from "../../store/themeStore";

export const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <Motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={toggleTheme}
      className="glow-hover inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/40 px-3 py-2 text-xs font-semibold text-slate-700 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
    >
      <span className="text-sm" aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </Motion.button>
  );
};
