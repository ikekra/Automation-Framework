import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext({
  pushToast: () => {}
});

const createToast = ({ message, tone = "info", duration = 3200 }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  message,
  tone,
  duration
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((payload) => {
    const toast = createToast(payload);
    setToasts((prev) => [...prev, toast]);
    if (toast.duration > 0) {
      setTimeout(() => removeToast(toast.id), toast.duration);
    }
  }, [removeToast]);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-6 right-6 z-[60] space-y-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex min-w-[240px] items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg ${
              toast.tone === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200"
                : toast.tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                  : "border-white/30 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-100"
            }`}
          >
            <span aria-hidden="true">
              {toast.tone === "error" ? "⚠️" : toast.tone === "success" ? "✅" : "ℹ️"}
            </span>
            <span className="flex-1 leading-relaxed">{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-2 inline-flex rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:text-slate-200 dark:hover:bg-slate-800/80"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
