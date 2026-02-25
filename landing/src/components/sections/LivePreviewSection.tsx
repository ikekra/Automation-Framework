"use client";

import { motion as Motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card } from "@/components/ui/card";

const screenshotImage =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1300&q=80";

const useCountUp = (target: number, duration = 1000) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const steps = 30;
    const increment = target / steps;
    const interval = duration / steps;

    const id = window.setInterval(() => {
      frame += 1;
      setValue((prev) => {
        const next = prev + increment;
        return frame >= steps ? target : next;
      });

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
    <AnimatedSection className="px-4 py-20 sm:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">Live Preview</p>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Real-Time Error Report Experience</h2>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="grid gap-4 lg:grid-cols-[1.2fr_1fr]"
        >
          <Card className="overflow-hidden p-4">
            <Image
              src={screenshotImage}
              alt="Report screenshot preview"
              width={1000}
              height={620}
              className="h-auto w-full rounded-xl border border-slate-200/60 object-cover dark:border-white/15"
              loading="lazy"
            />
          </Card>

          <div className="grid gap-4">
            <Card className="p-5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Detected Issues</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="rounded-lg bg-rose-500/15 px-3 py-2 text-rose-700 dark:text-rose-200">Unhandled promise rejection on checkout flow</li>
                <li className="rounded-lg bg-amber-500/15 px-3 py-2 text-amber-700 dark:text-amber-200">Slow API response on /pricing endpoint</li>
                <li className="rounded-lg bg-indigo-500/15 px-3 py-2 text-indigo-700 dark:text-indigo-200">Console warning from deprecated package</li>
              </ul>
            </Card>

            <Card className="grid grid-cols-3 gap-3 p-5 text-center">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
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
