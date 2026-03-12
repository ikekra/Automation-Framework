import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { PublicOnlyRoute } from "../routes/PublicOnlyRoute";
import { AdminRoute } from "../routes/AdminRoute";
import { AppLayout } from "../layouts/AppLayout";

const LandingPage = lazy(() => import("../pages/LandingPage").then((mod) => ({ default: mod.LandingPage })));
const LoginPage = lazy(() => import("../pages/LoginPage").then((mod) => ({ default: mod.LoginPage })));
const RegisterPage = lazy(() => import("../pages/RegisterPage").then((mod) => ({ default: mod.RegisterPage })));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage").then((mod) => ({ default: mod.VerifyEmailPage })));
const DashboardPage = lazy(() => import("../pages/DashboardPage").then((mod) => ({ default: mod.DashboardPage })));
const FrameworkBuilderPage = lazy(() => import("../pages/FrameworkBuilderPage").then((mod) => ({ default: mod.FrameworkBuilderPage })));
const HistoryPage = lazy(() => import("../pages/HistoryPage").then((mod) => ({ default: mod.HistoryPage })));
const WebAppTesterPage = lazy(() => import("../pages/WebAppTesterPage").then((mod) => ({ default: mod.WebAppTesterPage })));
const InternalSelfTestPage = lazy(() => import("../pages/InternalSelfTestPage").then((mod) => ({ default: mod.InternalSelfTestPage })));
const ProfilePage = lazy(() => import("../pages/ProfilePage").then((mod) => ({ default: mod.ProfilePage })));

const PageLoader = () => (
  <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col gap-4 px-4 py-10 sm:px-6">
    <div className="skeleton h-12 w-2/3" />
    <div className="skeleton h-48 w-full" />
    <div className="grid gap-4 md:grid-cols-2">
      <div className="skeleton h-40 w-full" />
      <div className="skeleton h-40 w-full" />
    </div>
  </div>
);

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/framework-builder" element={<FrameworkBuilderPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/web-app-tester" element={<WebAppTesterPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/internal-self-test" element={<InternalSelfTestPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};
