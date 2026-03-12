"use client";

import { motion as Motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";

const screenshotImage =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1300&q=80";

const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const steps = 24;
    const increment = target / steps;
    const interval = duration / steps;

    const id = window.setInterval(() => {
      frame += 1;
      setValue((prev) => (frame >= steps ? target : prev + increment));
      if (frame >= steps) {
        window.clearInterval(id);
      }
    }, interval);

    return () => window.clearInterval(id);
  }, [target, duration]);

  return Math.round(value);
};

export const LivePreviewSection = () => {
  const errors = useCountUp(17);
  const issues = useCountUp(3);
  const perf = useCountUp(482);

  const metrics = useMemo(
    () => [
      { label: "Errors Found", value: errors },
      { label: "Critical Issues", value: issues },
      { label: "Load Time", value: perf, suffix: "ms" }
    ],
    [errors, issues, perf]
  );

  return (
    <AnimatedSection id="preview" className="px-4 py-24 sm:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-[#1f3b73] dark:text-[#7bc6ff]">Live Preview</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">Structured Report Interface</h2>
        </header>

        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="grid gap-6 lg:grid-cols-[1.2fr_1fr]"
        >
          <Card className="overflow-hidden p-4">
            <Image
              src={screenshotImage}
              alt="Bug report screenshot preview"
              width={1000}
              height={620}
              sizes="(max-width: 1024px) 100vw, 720px"
              className="h-auto w-full rounded-lg border border-slate-200 object-cover dark:border-slate-800"
              loading="lazy"
            />
          </Card>

          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Detected Issues</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">Unhandled promise rejection on checkout flow</li>
                <li className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">Slow API response on /pricing endpoint</li>
                <li className="rounded-md border border-[#b7c8e8] bg-[#edf2fb] px-3 py-2 text-[#1f3b73] dark:border-[#2b5cb8] dark:bg-[#16233a] dark:text-[#7bc6ff]">Console warning from deprecated package</li>
              </ul>
            </Card>

            <Card className="grid grid-cols-3 gap-4 p-6 text-center">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {metric.value}
                    {metric.suffix || ""}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{metric.label}</p>
                </div>
              ))}
            </Card>
          </div>
        </Motion.div>
      </div>
    </AnimatedSection>
  );
};
