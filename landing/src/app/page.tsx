"use client";

import Image from "next/image";
import { motion as Motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Clock3,
  Globe,
  MessageSquareQuote,
  Rocket,
  Shield,
  Sparkles
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Activity,
    title: "Automated Monitoring",
    description: "Track key user flows with repeatable checks and instant issue visibility."
  },
  {
    icon: BrainCircuit,
    title: "AI Issue Insights",
    description: "Get likely root causes and clear next actions instead of raw logs."
  },
  {
    icon: Shield,
    title: "Reliability Guardrails",
    description: "Detect failures early with secure scanning and safe target validation."
  },
  {
    icon: Globe,
    title: "Cross-Environment Testing",
    description: "Run scans on local, staging, and production URLs from one workflow."
  },
  {
    icon: Clock3,
    title: "Fast Triage",
    description: "Pinpoint high-impact issues quickly with screenshots and timelines."
  },
  {
    icon: Rocket,
    title: "Release Confidence",
    description: "Ship faster with measurable quality checks before every deployment."
  }
];

const steps = [
  {
    title: "Connect Your URL",
    description: "Add your target site and choose the flows you want to validate."
  },
  {
    title: "Run Smart Scans",
    description: "AutoForge executes browser checks and collects runtime diagnostics."
  },
  {
    title: "Fix With Confidence",
    description: "Use prioritized reports and AI guidance to resolve issues faster."
  }
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    details: "Best for individual developers",
    points: ["20 scans/month", "Basic diagnostics", "Email support"]
  },
  {
    name: "Pro",
    price: "$49",
    details: "For growing product teams",
    points: ["Unlimited scans", "AI analysis", "Priority queue", "Export reports"],
    featured: true
  },
  {
    name: "Business",
    price: "$129",
    details: "For teams at scale",
    points: ["Team workspaces", "Admin controls", "SLA support", "Audit history"]
  }
];

const testimonials = [
  {
    avatar: "https://avatars.githubusercontent.com/u/583231?v=4",
    name: "Ava Wilson",
    role: "Frontend Lead",
    feedback: "We reduced pre-release bugs significantly after adding AutoForge checks."
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/19864447?v=4",
    name: "Daniel Kim",
    role: "Engineering Manager",
    feedback: "The reports are clean and actionable. Our QA to dev handoff is much faster."
  },
  {
    avatar: "https://avatars.githubusercontent.com/u/810438?v=4",
    name: "Mia Patel",
    role: "Product Engineer",
    feedback: "The UI is simple, and the AI analysis helps us prioritize what matters."
  }
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden surface-gradient text-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 -z-20 bg-grid opacity-30" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 surface-noise opacity-35" aria-hidden="true" />
      <Motion.div
        className="floating-orb -left-12 top-14 -z-10 h-56 w-56 bg-indigo-300/45 dark:bg-indigo-600/30"
        animate={{ x: [0, 12, 0], y: [0, -12, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        aria-hidden="true"
      />
      <Motion.div
        className="floating-orb right-[-40px] top-[38%] -z-10 h-72 w-72 bg-cyan-300/35 dark:bg-cyan-500/25"
        animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity }}
        aria-hidden="true"
      />

      <Navbar />

      <main>
        <Hero />

        <section id="features" className="px-4 py-24 sm:px-6">
          <div className="mx-auto w-full max-w-6xl space-y-10 rounded-2xl p-6 section-panel sm:p-8">
            <header className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">Features</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Everything you need for reliable releases</h2>
            </header>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="rounded-xl border-slate-200 bg-white/95 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90"
                >
                  <feature.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="px-4 py-24 sm:px-6">
          <div className="mx-auto w-full max-w-6xl space-y-10">
            <header className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">How It Works</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Simple flow, clear outcomes</h2>
            </header>

            <ol className="grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="relative rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                  {index < steps.length - 1 ? (
                    <span className="absolute right-[-10px] top-10 hidden h-px w-5 bg-indigo-300 md:block dark:bg-indigo-700" />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" className="px-4 py-24 sm:px-6">
          <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-2xl p-6 section-panel lg:grid-cols-[1fr_1.1fr] lg:items-center sm:p-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80"
                alt="Team reviewing analytics dashboard"
                width={900}
                height={620}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">About</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Built to help teams improve quality without slowing delivery</h2>
              <p className="text-sm text-slate-600 sm:text-base dark:text-slate-300">
                AutoForge combines browser automation, diagnostics, and AI analysis to give engineering teams a dependable quality workflow.
              </p>
              <ul className="space-y-3">
                {[
                  "Faster issue detection across key user journeys",
                  "Clear, shareable reports for QA and engineering",
                  "Consistent release checks with better visibility"
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="testimonials" className="px-4 py-24 sm:px-6">
          <div className="mx-auto w-full max-w-6xl space-y-10">
            <header className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">Testimonials</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Loved by modern product teams</h2>
            </header>

            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <Card key={item.name} className="rounded-xl border-slate-200 bg-white/95 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="flex items-center gap-3">
                    <Image src={item.avatar} alt={item.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                    </div>
                  </div>
                  <MessageSquareQuote className="mt-4 h-4 w-4 text-indigo-500" />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.feedback}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-24 sm:px-6">
          <div className="mx-auto w-full max-w-6xl space-y-10 rounded-2xl p-6 section-panel sm:p-8">
            <header className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">Pricing</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">Simple plans that scale with your team</h2>
            </header>

            <div className="grid gap-5 lg:grid-cols-3">
              {pricing.map((plan) => (
                <Card
                  key={plan.name}
                  className={`rounded-xl border p-6 shadow-sm ${
                    plan.featured
                      ? "border-indigo-400 bg-indigo-600 text-white shadow-indigo-300/50 dark:border-indigo-500 dark:bg-indigo-600"
                      : "border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/90"
                  }`}
                >
                  {plan.featured ? (
                    <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Recommended</span>
                  ) : null}
                  <h3 className={`mt-3 text-lg font-semibold ${plan.featured ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>{plan.name}</h3>
                  <p className={`mt-2 text-3xl font-bold ${plan.featured ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                    {plan.price}
                    <span className={`text-sm font-medium ${plan.featured ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"}`}>/mo</span>
                  </p>
                  <p className={`mt-2 text-sm ${plan.featured ? "text-indigo-100" : "text-slate-600 dark:text-slate-300"}`}>{plan.details}</p>

                  <ul className="mt-5 space-y-2">
                    {plan.points.map((point) => (
                      <li key={point} className={`flex items-start gap-2 text-sm ${plan.featured ? "text-indigo-50" : "text-slate-700 dark:text-slate-200"}`}>
                        <CircleDot className="mt-0.5 h-4 w-4" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="mt-6 w-full" variant={plan.featured ? "secondary" : "default"}>
                    Choose {plan.name}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 pt-8 sm:px-6">
          <div className="mx-auto w-full max-w-6xl rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 p-10 text-center text-white shadow-xl shadow-indigo-300/40 dark:shadow-indigo-950/50">
            <Sparkles className="mx-auto h-6 w-6 text-cyan-100" />
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Ready to improve release quality?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-indigo-50">
              Start scanning your application today and give your team a faster, more reliable QA workflow.
            </p>
            <Button className="mt-6 bg-white text-indigo-700 hover:bg-indigo-50">Start Free Trial</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
