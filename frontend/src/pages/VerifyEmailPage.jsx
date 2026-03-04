import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { GlassCard } from "../components/ui/GlassCard";
import { useToast } from "../context/ToastContext";
import { useAuthStore } from "../store/authStore";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const resendVerification = useAuthStore((state) => state.resendVerification);
  const { pushToast } = useToast();

  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get("token") || "";
  const emailFromState = location.state?.email || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [email, setEmail] = useState(emailFromState);
  const [message, setMessage] = useState({ text: "", tone: "success" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const onVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ text: "", tone: "success" });

    try {
      await verifyEmail({ token });
      setMessage({ text: "Email verified. You can log in now.", tone: "success" });
      pushToast({ message: "Email verified.", tone: "success" });
      navigate("/login", { replace: true });
    } catch (error) {
      const msg = error?.response?.data?.message || "Verification failed.";
      setMessage({ text: msg, tone: "error" });
      pushToast({ message: msg, tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setMessage({ text: "", tone: "success" });
    try {
      await resendVerification({ email });
      setMessage({ text: "Verification email sent. Check your inbox.", tone: "success" });
      pushToast({ message: "Verification email sent.", tone: "success" });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to resend email.";
      setMessage({ text: msg, tone: "error" });
      pushToast({ message: msg, tone: "error" });
    }
  };

  return (
    <PageShell title="Verify email" subtitle="Complete verification to access your workspace.">
      <GlassCard className="p-6">
        <form onSubmit={onVerify} className="space-y-4">
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Verification token
            <input
              className="input"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste the verification token"
              required
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Verify email"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate("/login")}
            >
              Go to login
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-white/20 pt-4 dark:border-white/10">
          <p className="text-sm text-muted">Didn’t receive a token?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              className="input max-w-xs"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="button" onClick={onResend} className="btn-secondary">
              Resend verification
            </button>
          </div>
        </div>

        {message.text ? (
          <p
            className={`mt-4 text-sm ${
              message.tone === "error" ? "text-rose-600 dark:text-rose-300" : "text-emerald-600 dark:text-emerald-300"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </GlassCard>
    </PageShell>
  );
};
