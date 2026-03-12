"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroImage =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1500&q=80";

const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

export const Hero = () => {
  return (
    <section id="home" className="px-4 pb-24 pt-14 sm:px-6 sm:pt-24" aria-labelledby="hero-title">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-[#b7c8e8] bg-[#edf2fb] px-3 py-1 text-xs font-medium text-[#1f3b73] dark:border-[#2b5cb8] dark:bg-[#16233a] dark:text-[#7bc6ff]">
            Modern QA Workflow
          </span>

          <h1 id="hero-title" className="text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-50">
            Ship Reliable Web Apps With AI-Powered Testing
          </h1>

          <p className="max-w-2xl text-pretty text-base text-slate-600 sm:text-lg dark:text-slate-300">
            Detect runtime issues, performance regressions, and critical errors in minutes with actionable reports your team can use immediately.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`${appUrl}/register`}
              className={cn(buttonVariants({ size: "lg" }), "group")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="#demo" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Live Demo
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40">
            <Image
              src={heroImage}
              alt="Developer working on a code dashboard"
              width={700}
              height={470}
              sizes="(max-width: 1024px) 100vw, 700px"
              className="h-auto w-full rounded-xl object-cover"
              priority
            />

            <div className="absolute right-4 top-4 rounded-lg border border-[#7bc6ff]/30 bg-slate-950/90 p-3 text-xs text-slate-200 backdrop-blur">
              <p className="font-semibold text-[#7bc6ff]">Availability 99.9%</p>
              <p className="mt-1 text-slate-300">3 high-priority issues resolved</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
