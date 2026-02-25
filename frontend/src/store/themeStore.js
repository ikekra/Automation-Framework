import { create } from "zustand";
import { persist } from "zustand/middleware";

const getPreferredTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: getPreferredTheme(),

      setTheme(theme) {
        set({ theme });
      },

      toggleTheme() {
        set({ theme: get().theme === "dark" ? "light" : "dark" });
      }
    }),
    {
      name: "autoforge-theme"
    }
  )
);
