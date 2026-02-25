"use client";

import Image from "next/image";
import Link from "next/link";
import { motion as Motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1500&q=80";

export const Hero = () => {
  return (
    <section id="home" className="px-4 pb-24 pt-14 sm:px-6 sm:pt-24" aria-labelledby="hero-title">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
            Modern QA Workflow
          </span>

          <h1 id="hero-title" className="text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-50">
            Ship Reliable Web Apps With AI-Powered Testing
          </h1>

          <p className="max-w-2xl text-pretty text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Detect runtime issues, performance regressions, and critical errors in minutes with actionable reports your team can use immediately.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/auth/signin">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg">
                <PlayCircle className="mr-2 h-4 w-4" />
                Live Demo
              </Button>
            </Link>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
            <Image
              src={heroImage}
              alt="Developer working on a code dashboard"
              width={700}
              height={470}
              className="h-auto w-full rounded-xl object-cover"
              priority
            />

            <div className="absolute right-4 top-4 rounded-lg border border-indigo-400/25 bg-slate-950/90 p-3 text-xs text-slate-200 backdrop-blur">
              <p className="font-semibold text-cyan-300">Availability 99.9%</p>
              <p className="mt-1 text-slate-300">3 high-priority issues resolved</p>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};
