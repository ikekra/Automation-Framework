import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { PageShell } from "../components/PageShell";
import { GlassCard } from "../components/ui/GlassCard";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext";
import { useAuthStore } from "../store/authStore";

const planOptions = ["Starter", "Pro", "Enterprise"];

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);
  const setupTwoFactor = useAuthStore((state) => state.setupTwoFactor);
  const verifyTwoFactor = useAuthStore((state) => state.verifyTwoFactor);
  const disableTwoFactor = useAuthStore((state) => state.disableTwoFactor);
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const showSkeletons = !user;

  const [form, setForm] = useState({
    name: user?.name || "",
    organization: user?.organization || "",
    phone: user?.phone || "",
    plan: user?.plan || "Starter"
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", tone: "success" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordMessage, setPasswordMessage] = useState({ text: "", tone: "success" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [twoFactor, setTwoFactor] = useState({ secret: "", otpauthUrl: "", token: "" });
  const [twoFactorMessage, setTwoFactorMessage] = useState({ text: "", tone: "success" });
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const lastLoginLabel = useMemo(() => {
    if (!user?.lastLogin) {
      return "Unavailable";
    }

    const parsed = new Date(user.lastLogin);
    if (Number.isNaN(parsed.getTime())) {
      return "Unavailable";
    }

    return parsed.toLocaleString();
  }, [user?.lastLogin]);

  useEffect(() => {
    let active = true;

    const buildQr = async () => {
      if (!twoFactor.otpauthUrl) {
        setQrDataUrl("");
        return;
      }

      try {
        const dataUrl = await QRCode.toDataURL(twoFactor.otpauthUrl, { width: 220, margin: 1 });
        if (active) {
          setQrDataUrl(dataUrl);
        }
      } catch {
        if (active) {
          setQrDataUrl("");
        }
      }
    };

    buildQr();

    return () => {
      active = false;
    };
  }, [twoFactor.otpauthUrl]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ text: "", tone: "success" });

    try {
      await updateProfile({
        name: form.name.trim(),
        organization: form.organization.trim() || null,
        phone: form.phone.trim() || null,
        plan: form.plan
      });
      setMessage({ text: "Profile updated.", tone: "success" });
      pushToast({ message: "Profile updated.", tone: "success" });
    } catch (error) {
      setMessage({ text: error?.message || "Failed to update profile.", tone: "error" });
      pushToast({ message: error?.message || "Failed to update profile.", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const onPasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const onPasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage({ text: "", tone: "success" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ text: "Passwords do not match.", tone: "error" });
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordMessage({ text: "Password updated. Please log in again.", tone: "success" });
      pushToast({ message: "Password updated. Please log in again.", tone: "success" });
      navigate("/login", { replace: true });
    } catch (error) {
      setPasswordMessage({ text: error?.message || "Failed to update password.", tone: "error" });
      pushToast({ message: error?.message || "Failed to update password.", tone: "error" });
    } finally {
      setPasswordSaving(false);
    }
  };

  const onTwoFactorSetup = async () => {
    setTwoFactorMessage({ text: "", tone: "success" });
    setTwoFactorLoading(true);
    try {
      const data = await setupTwoFactor();
      setTwoFactor({ secret: data.secret, otpauthUrl: data.otpauthUrl, token: "" });
      setTwoFactorMessage({ text: "Scan the QR or enter the secret, then verify.", tone: "success" });
      pushToast({ message: "2FA setup started.", tone: "success" });
    } catch (error) {
      setTwoFactorMessage({ text: error?.response?.data?.message || "Failed to start 2FA setup.", tone: "error" });
      pushToast({ message: error?.response?.data?.message || "Failed to start 2FA setup.", tone: "error" });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const onTwoFactorVerify = async (event) => {
    event.preventDefault();
    setTwoFactorMessage({ text: "", tone: "success" });
    setTwoFactorLoading(true);
    try {
      await verifyTwoFactor({ token: twoFactor.token });
      setTwoFactor({ secret: "", otpauthUrl: "", token: "" });
      setTwoFactorMessage({ text: "Two-factor authentication enabled.", tone: "success" });
      pushToast({ message: "Two-factor authentication enabled.", tone: "success" });
    } catch (error) {
      setTwoFactorMessage({ text: error?.response?.data?.message || "Failed to verify code.", tone: "error" });
      pushToast({ message: error?.response?.data?.message || "Failed to verify code.", tone: "error" });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const onTwoFactorDisable = async (event) => {
    event.preventDefault();
    setTwoFactorMessage({ text: "", tone: "success" });
    setTwoFactorLoading(true);
    try {
      await disableTwoFactor({ token: twoFactor.token });
      setTwoFactor({ secret: "", otpauthUrl: "", token: "" });
      setTwoFactorMessage({ text: "Two-factor authentication disabled.", tone: "success" });
      pushToast({ message: "Two-factor authentication disabled.", tone: "success" });
    } catch (error) {
      setTwoFactorMessage({ text: error?.response?.data?.message || "Failed to disable 2FA.", tone: "error" });
      pushToast({ message: error?.response?.data?.message || "Failed to disable 2FA.", tone: "error" });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  return (
    showSkeletons ? (
      <PageShell title="Profile" subtitle="Loading profile details...">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </PageShell>
    ) : (
    <PageShell
      title="Profile"
      subtitle="Update your workspace details and account preferences."
    >
      <div className="flex flex-wrap gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user?.emailVerified ? "bg-[color:var(--primary-ink)] text-[color:var(--primary-deep)] dark:text-[color:var(--text-main)]" : "accent-badge"}`}>
          {user?.emailVerified ? "Email verified" : "Email not verified"}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user?.totpEnabled ? "brand-badge" : "bg-white/70 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200"}`}>
          {user?.totpEnabled ? "2FA enabled" : "2FA disabled"}
        </span>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
          Plan: {user?.plan || "Starter"}
        </span>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Full name
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
              <input
                className="input"
                value={user?.email || ""}
                readOnly
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Organization
              <input
                className="input"
                name="organization"
                value={form.organization}
                onChange={onChange}
                placeholder="Company or team"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Phone
              <input
                className="input"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="+1 555 123 4567"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Plan
              <select
                className="input"
                name="plan"
                value={form.plan}
                onChange={onChange}
              >
                {planOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Last login
              <input className="input" value={lastLoginLabel} readOnly />
            </label>
          </div>

          {message.text ? (
            <p
              className={`text-sm ${
                message.tone === "error"
                  ? "text-rose-600 dark:text-rose-300"
                  : "text-emerald-600 dark:text-emerald-300"
              }`}
            >
              {message.text}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <form onSubmit={onPasswordSubmit} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Change password</h2>
            <p className="mt-1 text-sm text-muted">For security, you’ll be asked to log in again.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Current password
              <input
                className="input"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={onPasswordChange}
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              New password
              <input
                className="input"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={onPasswordChange}
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200 md:col-span-2">
              Confirm new password
              <input
                className="input"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={onPasswordChange}
                required
              />
            </label>
          </div>

          {passwordMessage.text ? (
            <p
              className={`text-sm ${
                passwordMessage.tone === "error"
                  ? "text-rose-600 dark:text-rose-300"
                  : "text-emerald-600 dark:text-emerald-300"
              }`}
            >
              {passwordMessage.text}
            </p>
          ) : null}

          <button type="submit" className="btn-primary" disabled={passwordSaving}>
            {passwordSaving ? "Updating..." : "Update password"}
          </button>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Two-factor authentication</h2>
            <p className="mt-1 text-sm text-muted">Secure your account with an authenticator app.</p>
          </div>

          {user?.totpEnabled ? (
            <form onSubmit={onTwoFactorDisable} className="space-y-3">
              <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Enter 2FA code to disable
                <input
                  className="input"
                  name="token"
                  value={twoFactor.token}
                  onChange={(event) => setTwoFactor((prev) => ({ ...prev, token: event.target.value }))}
                  required
                />
              </label>
              <button type="submit" className="btn-secondary" disabled={twoFactorLoading}>
                {twoFactorLoading ? "Updating..." : "Disable 2FA"}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <button type="button" onClick={onTwoFactorSetup} className="btn-primary" disabled={twoFactorLoading}>
                {twoFactorLoading ? "Preparing..." : "Set up 2FA"}
              </button>

              {twoFactor.secret ? (
                <form onSubmit={onTwoFactorVerify} className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-[220px,1fr]">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="QR code for authenticator"
                        className="rounded-2xl border border-white/20 bg-white/80 p-2"
                      />
                    ) : null}
                    <div className="rounded-2xl border border-white/20 bg-white/50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted">Manual setup key</p>
                      <p className="mt-2 font-mono text-sm break-all">{twoFactor.secret}</p>
                      <p className="mt-2 text-xs text-muted">OTPAuth URL:</p>
                      <p className="mt-1 text-xs break-all">{twoFactor.otpauthUrl}</p>
                    </div>
                  </div>

                  <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    Enter 2FA code
                    <input
                      className="input"
                      name="token"
                      value={twoFactor.token}
                      onChange={(event) => setTwoFactor((prev) => ({ ...prev, token: event.target.value }))}
                      required
                    />
                  </label>

                  <button type="submit" className="btn-primary" disabled={twoFactorLoading}>
                    {twoFactorLoading ? "Verifying..." : "Verify & enable"}
                  </button>
                </form>
              ) : null}
            </div>
          )}

          {twoFactorMessage.text ? (
            <p
              className={`text-sm ${
                twoFactorMessage.tone === "error"
                  ? "text-rose-600 dark:text-rose-300"
                  : "text-emerald-600 dark:text-emerald-300"
              }`}
            >
              {twoFactorMessage.text}
            </p>
          ) : null}
        </div>
      </GlassCard>
    </PageShell>
    )
  );
};
