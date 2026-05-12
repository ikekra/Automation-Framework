import { useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { AppBackground } from "../components/AppBackground";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { ToastProvider } from "../context/ToastContext";
import { useAuthStore } from "../store/authStore";
import { useFrameworkStore } from "../store/frameworkStore";
import { useThemeStore } from "../store/themeStore";

export const AppChrome = () => {
  const theme = useThemeStore((state) => state.theme);
  const userId = useAuthStore((state) => state.user?.id || null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearHistory = useFrameworkStore((state) => state.clearHistory);
  const previousUserId = useRef(userId);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const switchedUsers = previousUserId.current && userId && previousUserId.current !== userId;

    if (!isAuthenticated || switchedUsers) {
      clearHistory();
    }

    previousUserId.current = userId;
  }, [clearHistory, isAuthenticated, userId]);

  return (
    <ToastProvider>
      <a className="skip-link" href="#app-main">
        Skip to main content
      </a>
      <AppBackground />
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ToastProvider>
  );
};
