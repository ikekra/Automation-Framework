import { motion as Motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const titleCase = isRegister ? "Registration" : "Authentication";

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }

      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      const networkMessage =
        err?.code === "ERR_NETWORK"
          ? "Cannot reach backend API. Check backend server and CORS settings."
          : "";
      setError(apiMessage || networkMessage || `${titleCase} failed`);
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

      {error ? <p className="rounded-xl bg-rose-100/70 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}

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

