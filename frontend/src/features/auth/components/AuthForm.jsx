import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { useAuthStore } from "../../../store/authStore";

const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const loginOtp = useAuthStore((state) => state.loginOtp);
  const resendVerification = useAuthStore((state) => state.resendVerification);
  const { pushToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [totp, setTotp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [totpRequired, setTotpRequired] = useState(false);
  const [authMethod, setAuthMethod] = useState("password");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const titleCase = isRegister ? "Registration" : "Authentication";

  useEffect(() => {
    if (otpCooldown <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpCooldown]);

  const handleLoginSuccess = () => {
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    navigate(redirectTo, { replace: true });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password });
        pushToast({ message: "Account created. Verify your email to continue.", tone: "success" });
        navigate("/verify-email", { replace: true, state: { email } });
        return;
      }

      if (authMethod === "otp") {
        await loginOtp({ email, otp, totp: totp || undefined });
        handleLoginSuccess();
        return;
      }

      await login({ email, password });
      handleLoginSuccess();
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      const apiCode = err?.response?.data?.details?.code;
      const networkMessage =
        err?.code === "ERR_NETWORK"
          ? "Cannot reach backend API. Check backend server and CORS settings."
          : "";

      if (apiCode === "EMAIL_NOT_VERIFIED") {
        setError("Email not verified. Please verify to continue.");
      } else if (apiCode === "TOTP_REQUIRED") {
        setError("Two-factor code required.");
        setTotpRequired(true);
      } else if (apiCode === "TOTP_INVALID") {
        setError("Invalid two-factor code.");
      } else {
        setError(apiMessage || networkMessage || `${titleCase} failed`);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRequestOtp = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const data = await requestOtp({ email });
      if (data?.verificationRequired) {
        setError("Email not verified. Check your inbox for a verification link.");
        return;
      }
      setOtpSent(true);
      setTotpRequired(Boolean(data?.totpRequired));
      setOtpCooldown(60);
      setInfo("Login code sent. Check your email.");
      pushToast({ message: "Login code sent.", tone: "success" });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to send login code.");
    } finally {
      setLoading(false);
    }
  };

  const onResendVerification = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      await resendVerification({ email });
      setInfo("Verification email sent. Check your inbox.");
      pushToast({ message: "Verification email sent.", tone: "success" });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isRegister ? (
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
          <input
            id="name"
            name="name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      {!isRegister ? (
        <div className="flex gap-2" role="tablist" aria-label="Login methods">
          <button
            type="button"
            onClick={() => setAuthMethod("password")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              authMethod === "password"
                ? "text-white"
                : "border border-white/30 bg-white/60 text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
            }`}
            style={authMethod === "password" ? { background: "var(--primary)" } : undefined}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("otp")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              authMethod === "otp"
                ? "text-white"
                : "border border-white/30 bg-white/60 text-slate-700 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200"
            }`}
            style={authMethod === "otp" ? { background: "var(--primary)" } : undefined}
          >
            Email code
          </button>
        </div>
      ) : null}

      {authMethod === "password" || isRegister ? (
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {isRegister ? (
            <p className="mt-1 text-xs text-muted">
              Use 8-72 chars with uppercase, lowercase, number, and special character.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRequestOtp}
              className="btn-secondary"
              disabled={loading || !email || otpCooldown > 0}
            >
              {otpSent ? (otpCooldown > 0 ? `Resend in ${formatCountdown(otpCooldown)}` : "Resend code") : "Send login code"}
            </button>
            {otpSent ? (
              <span className="text-xs text-muted">Code sent to your email.</span>
            ) : null}
          </div>

          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Login code
            <input
              className="input"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              required
            />
          </label>

          {totpRequired ? (
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Two-factor code
              <input
                className="input"
                value={totp}
                onChange={(event) => setTotp(event.target.value)}
                required
              />
            </label>
          ) : null}
        </div>
      )}

      {error ? <p className="rounded-xl bg-rose-100/70 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}
      {info ? <p className="rounded-xl bg-emerald-100/70 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">{info}</p> : null}

      {error && error.includes("Email not verified") ? (
        <button type="button" onClick={onResendVerification} className="btn-secondary w-full" disabled={loading || !email}>
          Resend verification email
        </button>
      ) : null}

      <Motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="btn-primary glow-hover w-full disabled:opacity-60"
      >
        {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
      </Motion.button>

      <p className="text-sm text-muted">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200">
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </form>
  );
};
