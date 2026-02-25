import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { AppBackground } from "../components/AppBackground";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useThemeStore } from "../store/themeStore";

export const AppChrome = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <AppBackground />
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};
