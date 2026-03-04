import { useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { EmptyState } from "../../../components/ui/EmptyState";
import { GlassCard } from "../../../components/ui/GlassCard";
import { useToast } from "../../../context/ToastContext";
import { frameworkService } from "../../../services/api/frameworkService";
import { useFrameworkStore } from "../../../store/frameworkStore";

const initialState = {
  language: "TypeScript",
  automationTool: "Playwright",
  pattern: "Page Object Model",
  testRunner: "Playwright Test",
  cicd: "GitHub Actions",
  dockerSupport: true
};

const steps = [
  { id: 0, title: "Stack" },
  { id: 1, title: "Execution" },
  { id: 2, title: "Delivery" }
];

export const FrameworkBuilderForm = () => {
  const [form, setForm] = useState(initialState);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const addHistoryItem = useFrameworkStore((state) => state.addHistoryItem);
  const { pushToast } = useToast();

  const canGoNext = useMemo(() => currentStep < steps.length - 1, [currentStep]);
  const canGoBack = useMemo(() => currentStep > 0, [currentStep]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onReset = () => {
    setForm(initialState);
    setResponse(null);
    setError("");
    setCurrentStep(0);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await frameworkService.generate(form);
      setResponse(data);

      addHistoryItem({
        id: data.id,
        language: form.language,
        automationTool: form.automationTool,
        testRunner: form.testRunner,
        filesCount: data.files?.length || 0,
        downloadLink: data.download?.link || "",
        createdAt: new Date().toISOString()
      });

      pushToast({ message: "Framework generated successfully.", tone: "success" });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to generate framework";
      setError(message);
      pushToast({ message, tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} />

      <form onSubmit={onSubmit} className="space-y-6">
        <GlassCard className="p-4 sm:p-5">
          <div className="grid gap-2 sm:grid-cols-3">
            {steps.map((step) => {
              const active = currentStep === step.id;
              const complete = currentStep > step.id;

              return (
                <Motion.button
                  key={step.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(step.id)}
                  className={`rounded-xl px-3 py-2 text-left text-sm ${
                    active
                      ? "bg-indigo-600 text-white"
                      : complete
                        ? "bg-cyan-100/80 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200"
                        : "bg-slate-100/80 text-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
                  }`}
                >
                  <p className="text-xs uppercase tracking-wide opacity-80">Step {step.id + 1}</p>
                  <p className="font-semibold">{step.title}</p>
                </Motion.button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {currentStep === 0 ? (
                <>
                  <div>
                    <label htmlFor="language" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Language</label>
                    <input id="language" className="input" value={form.language} onChange={(e) => onChange("language", e.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="automationTool" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Automation Tool</label>
                    <input id="automationTool" className="input" value={form.automationTool} onChange={(e) => onChange("automationTool", e.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="pattern" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Pattern</label>
                    <input id="pattern" className="input" value={form.pattern} onChange={(e) => onChange("pattern", e.target.value)} required />
                  </div>
                </>
              ) : null}

              {currentStep === 1 ? (
                <>
                  <div>
                    <label htmlFor="testRunner" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Test Runner</label>
                    <input id="testRunner" className="input" value={form.testRunner} onChange={(e) => onChange("testRunner", e.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="cicd" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">CI/CD</label>
                    <input id="cicd" className="input" value={form.cicd} onChange={(e) => onChange("cicd", e.target.value)} required />
                  </div>
                </>
              ) : null}

              {currentStep === 2 ? (
                <label className="glow-hover flex items-center gap-3 rounded-xl border border-white/30 bg-white/40 p-3 dark:border-white/10 dark:bg-slate-900/40">
                  <input
                    type="checkbox"
                    checked={form.dockerSupport}
                    onChange={(e) => onChange("dockerSupport", e.target.checked)}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Docker Support</p>
                    <p className="text-xs text-muted">Include Dockerfile and docker-compose for containerized runs.</p>
                  </div>
                </label>
              ) : null}
            </Motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setCurrentStep((s) => s - 1)} disabled={!canGoBack} className="btn-secondary disabled:opacity-50">
              Back
            </button>

            {canGoNext ? (
              <Motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => setCurrentStep((s) => s + 1)} className="btn-primary glow-hover">
                Next
              </Motion.button>
            ) : (
              <Motion.button type="submit" whileTap={{ scale: 0.98 }} className="btn-primary glow-hover" disabled={loading}>
                Generate Framework
              </Motion.button>
            )}

            <button type="button" onClick={onReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </GlassCard>

        {error ? <p className="rounded-xl bg-rose-100/75 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}

        {response ? (
          <GlassCard
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 p-5 sm:p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Generated Output</h2>
            <p className="text-sm text-muted">Folders: {response.folderStructure?.length || 0}</p>
            <p className="text-sm text-muted">Files: {response.files?.length || 0}</p>
            {response.download?.link ? (
              <a href={response.download.link} target="_blank" rel="noreferrer" className="btn-secondary glow-hover w-fit">
                Download ZIP
              </a>
            ) : null}
          </GlassCard>
        ) : (
          <EmptyState
            title="No framework generated yet"
            description="Complete the steps above and click Generate to build a starter framework."
            action={(
              <button type="button" className="btn-primary" onClick={() => setCurrentStep(steps.length - 1)}>
                Go to final step
              </button>
            )}
          />
        )}
      </form>
    </>
  );
};
