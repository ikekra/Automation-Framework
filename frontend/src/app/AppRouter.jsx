import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { VerifyEmailPage } from "../pages/VerifyEmailPage";
import { DashboardPage } from "../pages/DashboardPage";
import { FrameworkBuilderPage } from "../pages/FrameworkBuilderPage";
import { HistoryPage } from "../pages/HistoryPage";
import { WebAppTesterPage } from "../pages/WebAppTesterPage";
import { InternalSelfTestPage } from "../pages/InternalSelfTestPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { PublicOnlyRoute } from "../routes/PublicOnlyRoute";
import { AdminRoute } from "../routes/AdminRoute";
import { AppLayout } from "../layouts/AppLayout";

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
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
    </AnimatePresence>
  );
};
