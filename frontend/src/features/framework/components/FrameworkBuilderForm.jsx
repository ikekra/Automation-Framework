import { useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { EmptyState } from "../../../components/ui/EmptyState";
import { GlassCard } from "../../../components/ui/GlassCard";
import { useToast } from "../../../context/ToastContext";
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
  { id: 0, title: "Stack", hint: "Language, tooling, architecture" },
  { id: 1, title: "Execution", hint: "Runner and pipeline choices" },
  { id: 2, title: "Delivery", hint: "Packaging and deployment fit" }
];

const optionGroups = {
  languages: ["TypeScript", "JavaScript", "Python", "Java"],
  automationTools: ["Playwright", "Selenium", "Cypress"],
  patterns: ["Page Object Model", "Screenplay", "Hybrid Modular"],
  runners: ["Playwright Test", "Jest", "Pytest", "JUnit"],
  cicd: ["GitHub Actions", "GitLab CI", "Jenkins", "Azure Pipelines"]
};

const PillOption = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
      active
        ? "border-cyan-300 bg-cyan-500 text-slate-950 shadow-[0_14px_30px_-18px_rgba(34,211,238,0.9)]"
        : "border-white/20 bg-white/55 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800/70"
    }`}
  >
    {children}
  </button>
);

export const FrameworkBuilderForm = () => {
  const [form, setForm] = useState(initialState);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const generateFramework = useFrameworkStore((state) => state.generateFramework);
  const downloadHistoryItem = useFrameworkStore((state) => state.downloadHistoryItem);
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
      const data = await generateFramework(form);
      setResponse(data);
      pushToast({ message: "Framework generated and saved to your history.", tone: "success" });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to generate framework";
      setError(message);
      pushToast({ message, tone: "error" });
    } finally {
      setLoading(false);
    }
  };

  const generatedSummary = response?.summary || null;

  return (
    <>
      <LoadingOverlay visible={loading} title="Generating framework" subtitle="Composing folders, files, and account history entry..." />

      <form onSubmit={onSubmit} className="space-y-6">
        <GlassCard className="overflow-hidden p-0">
          <div className="grid gap-px bg-white/10 md:grid-cols-3">
            {steps.map((step) => {
              const active = currentStep === step.id;
              const complete = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`px-4 py-4 text-left transition ${
                    active
                      ? "bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950"
                      : complete
                        ? "bg-cyan-500/70 text-slate-950"
                        : "bg-white/65 text-slate-700 hover:bg-white dark:bg-slate-900/55 dark:text-slate-200 dark:hover:bg-slate-800/75"
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.26em] opacity-75">Step {step.id + 1}</p>
                  <p className="mt-2 text-base font-semibold">{step.title}</p>
                  <p className="mt-1 text-xs opacity-80">{step.hint}</p>
                </button>
              );
            })}
          </div>
        </GlassCard>

        <div className="grid gap-5 xl:grid-cols-[1.3fr,0.7fr]">
          <GlassCard className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <Motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {currentStep === 0 ? (
                  <>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">Language</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {optionGroups.languages.map((option) => (
                          <PillOption key={option} active={form.language === option} onClick={() => onChange("language", option)}>
                            {option}
                          </PillOption>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">Automation Tool</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {optionGroups.automationTools.map((option) => (
                          <PillOption key={option} active={form.automationTool === option} onClick={() => onChange("automationTool", option)}>
                            {option}
                          </PillOption>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pattern" className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-muted">
                        Framework Pattern
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {optionGroups.patterns.map((option) => (
                          <PillOption key={option} active={form.pattern === option} onClick={() => onChange("pattern", option)}>
                            {option}
                          </PillOption>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}

                {currentStep === 1 ? (
                  <>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">Test Runner</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {optionGroups.runners.map((option) => (
                          <PillOption key={option} active={form.testRunner === option} onClick={() => onChange("testRunner", option)}>
                            {option}
                          </PillOption>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">CI/CD Target</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {optionGroups.cicd.map((option) => (
                          <PillOption key={option} active={form.cicd === option} onClick={() => onChange("cicd", option)}>
                            {option}
                          </PillOption>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}

                {currentStep === 2 ? (
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-cyan-300/30 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_48%),rgba(255,255,255,0.52)] p-5 dark:border-cyan-300/20 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_48%),rgba(15,23,42,0.5)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">Delivery Options</p>
                      <label className="mt-4 flex items-start gap-3 rounded-2xl border border-white/35 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-900/55">
                        <input
                          type="checkbox"
                          checked={form.dockerSupport}
                          onChange={(event) => onChange("dockerSupport", event.target.checked)}
                          className="mt-1"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Include Docker support</p>
                          <p className="mt-1 text-sm text-muted">
                            Adds container-ready setup so the generated framework can run consistently across machines and CI.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="rounded-3xl border border-white/20 bg-white/55 p-5 dark:border-white/10 dark:bg-slate-900/45">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">Generation Preview</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-slate-50">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Stack</p>
                          <p className="mt-2 text-sm font-semibold">{form.language} | {form.automationTool}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Execution</p>
                          <p className="mt-2 text-sm font-semibold">{form.testRunner} via {form.cicd}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </Motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setCurrentStep((s) => s - 1)} disabled={!canGoBack} className="btn-secondary disabled:opacity-50">
                Back
              </button>

              {canGoNext ? (
                <Motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => setCurrentStep((s) => s + 1)} className="btn-primary glow-hover">
                  Continue
                </Motion.button>
              ) : (
                <Motion.button type="submit" whileTap={{ scale: 0.98 }} className="btn-primary glow-hover" disabled={loading}>
                  {loading ? "Generating..." : "Generate Framework"}
                </Motion.button>
              )}

              <button type="button" onClick={onReset} className="btn-secondary">
                Reset
              </button>
            </div>
          </GlassCard>

          <div className="space-y-5">
            <GlassCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">Current Blueprint</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <span>Language</span>
                  <span className="font-semibold">{form.language}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Automation</span>
                  <span className="font-semibold">{form.automationTool}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Pattern</span>
                  <span className="font-semibold">{form.pattern}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Runner</span>
                  <span className="font-semibold">{form.testRunner}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Pipeline</span>
                  <span className="font-semibold">{form.cicd}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Docker</span>
                  <span className="font-semibold">{form.dockerSupport ? "Included" : "Skipped"}</span>
                </div>
              </div>
            </GlassCard>

            {error ? <p className="rounded-2xl bg-rose-100/75 px-4 py-3 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-200">{error}</p> : null}

            {response ? (
              <GlassCard initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-muted">Generated Output</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Saved to your account history
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-950 px-4 py-4 text-slate-50">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Folders</p>
                    <p className="mt-2 text-2xl font-bold">{response.folderStructure?.length || 0}</p>
                  </div>
                  <div className="rounded-2xl bg-cyan-400 px-4 py-4 text-slate-950">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-700">Files</p>
                    <p className="mt-2 text-2xl font-bold">{response.files?.length || 0}</p>
                  </div>
                </div>

                {generatedSummary ? (
                  <button
                    type="button"
                    onClick={() => downloadHistoryItem(generatedSummary)}
                    className="btn-primary w-full"
                  >
                    Download This Build
                  </button>
                ) : null}
              </GlassCard>
            ) : (
              <EmptyState
                title="No framework generated yet"
                description="Complete the steps and generate a starter framework that will be saved to your account history."
                action={(
                  <button type="button" className="btn-primary" onClick={() => setCurrentStep(steps.length - 1)}>
                    Jump to final step
                  </button>
                )}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
};
