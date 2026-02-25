"use client";

import Image from "next/image";
import { motion as Motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImage =
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <span className="inline-flex rounded-full border border-indigo-300/50 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-300/30 dark:text-indigo-200">
            AI-Powered Testing for Modern Teams
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            Find Bugs Before Your Users Do.
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
            AI-powered web application testing, error detection, and performance analysis in seconds.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button className="group">
              Start Testing Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary">
              <PlayCircle className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-300/60 bg-white/40 p-2 backdrop-blur-2xl dark:border-white/15 dark:bg-white/10">
            <Image
              src={heroImage}
              alt="Developer workstation"
              width={700}
              height={470}
              className="h-auto w-full rounded-2xl object-cover"
              priority
            />

            <Motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute right-4 top-4 rounded-xl border border-white/20 bg-slate-950/80 p-3 text-xs text-slate-200"
            >
              <p className="font-semibold text-rose-300">3 critical issues detected</p>
              <p className="mt-1 text-slate-400">Performance drop: 480ms</p>
            </Motion.div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};
