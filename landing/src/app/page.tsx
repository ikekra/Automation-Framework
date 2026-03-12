"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "SDK", href: "#showcase" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#pricing" }
];

const stats = [
  { label: "tests per day", value: 2400000, suffix: "+" },
  { label: "uptime", value: 9999, suffix: "%" },
  { label: "integrations", value: 200, suffix: "+" },
  { label: "engineers", value: 18000, suffix: "+" }
];

const features = [
  {
    title: "Zero-config setup",
    description: "Spin up pipelines with a single config file and opinionated defaults.",
    accent: "#00e5ff",
    icon: "⚡"
  },
  {
    title: "AI orchestration",
    description: "Adaptive retries and smart parallelism keep your suites fast and reliable.",
    accent: "#7c3aed",
    icon: "🧠"
  },
  {
    title: "Parallel execution",
    description: "Distribute workloads across runners with autoscaling and adaptive queues.",
    accent: "#f97316",
    icon: "🧩"
  },
  {
    title: "Universal connectors",
    description: "Plug into CI/CD, cloud, and observability stacks without custom glue code.",
    accent: "#00e5ff",
    icon: "🔌"
  },
  {
    title: "Real-time observability",
    description: "Track latency, flakiness, and failures with live diagnostics and traces.",
    accent: "#7c3aed",
    icon: "📡"
  },
  {
    title: "Enterprise security",
    description: "SSO, SOC-ready controls, and hardened scanning baked in by default.",
    accent: "#f97316",
    icon: "🛡️"
  }
];

const pipelineSteps = [
  {
    name: "Define",
    description: "Model suites with clear ownership.",
    icon: "🧭"
  },
  {
    name: "Lint",
    description: "Enforce style and guardrails.",
    icon: "🧪"
  },
  {
    name: "Execute",
    description: "Parallel runs at full speed.",
    icon: "⚙️"
  },
  {
    name: "Observe",
    description: "Trace every signal in real time.",
    icon: "👀"
  },
  {
    name: "Ship",
    description: "Confident releases every time.",
    icon: "🚀"
  }
];

const integrations = [
  "GitHub",
  "GitLab",
  "Jira",
  "Linear",
  "AWS",
  "GCP",
  "Azure",
  "Vercel",
  "Datadog",
  "Slack",
  "Docker",
  "Kubernetes",
  "Terraform",
  "PagerDuty",
  "Sentry",
  "CircleCI",
  "Buildkite",
  "Figma"
];

const pricing = [
  {
    tier: "Free",
    price: "$0",
    description: "Best for solo builders getting started.",
    features: ["Community access", "1 pipeline", "Basic analytics", "Email support"]
  },
  {
    tier: "Pro",
    price: "$49/mo",
    description: "For teams shipping weekly releases.",
    features: ["Unlimited pipelines", "AI orchestration", "Priority queue", "Exportable reports"],
    featured: true
  },
  {
    tier: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure and compliance.",
    features: ["SSO/SAML", "Audit trails", "Dedicated success", "Custom SLAs"]
  }
];

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [activeStep, setActiveStep] = useState(0);
  const countersStarted = useRef(false);

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const statsSection = document.getElementById("stats");
    if (!statsSection) return;

    const animateCounter = (index, target) => {
      const start = performance.now();
      const duration = 1200;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        setCounts((prev) => {
          const next = [...prev];
          next[index] = value;
          return next;
        });
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted.current) {
            countersStarted.current = true;
            stats.forEach((stat, index) => animateCounter(index, stat.value));
          }
        });
      },
      { threshold: 0.2 }
    );

    counterObserver.observe(statsSection);

    return () => counterObserver.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const formattedCounts = useMemo(() =>
    counts.map((value, index) => {
      const stat = stats[index];
      const formatted = new Intl.NumberFormat("en-US").format(value);
      return `${formatted}${stat.suffix}`;
    }),
  [counts]);

  const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid-overlay" aria-hidden="true" />
      <div className="orb cyan" style={{ width: 360, height: 360, top: "-120px", left: "-120px" }} />
      <div className="orb purple" style={{ width: 420, height: 420, top: "20%", right: "-180px" }} />
      <div className="orb blue" style={{ width: 360, height: 360, bottom: "-140px", left: "30%" }} />

      <header className="nav-load sticky top-0 z-30 border-b border-[var(--border)] bg-[color:rgba(255,255,255,0.8)] backdrop-blur dark:bg-[color:rgba(6,10,16,0.8)]">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] bg-clip-text text-transparent">⚡ AutoFlow</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-[var(--muted-foreground)] md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href={`${appUrl}/login`} className="btn-secondary rounded-full px-4 py-2 text-xs font-semibold">
              Get started
            </Link>
            <button
              type="button"
              className="btn-secondary rounded-full px-3 py-2 text-xs font-semibold md:hidden"
              onClick={() => setNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              Menu
            </button>
          </div>
        </nav>
        {navOpen ? (
          <div className="md:hidden">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pb-4 text-sm text-[var(--muted-foreground)] sm:px-6">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]" onClick={() => setNavOpen(false)}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="mx-auto flex min-h-[90vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <div className="stagger flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 text-xs text-[var(--muted-foreground)]" style={{ animationDelay: "0.1s" }}>
            <span className="badge-dot" />
            v3.0 — Now with AI-powered pipelines
          </div>
          <h1 className="stagger mt-6 text-4xl font-extrabold sm:text-6xl" style={{ animationDelay: "0.2s" }}>
            Automate Everything.
            <span className="block bg-gradient-to-r from-[#00e5ff] via-[#7c3aed] to-[#f97316] bg-clip-text text-transparent">
              Ship Faster.
            </span>
          </h1>
          <p className="stagger mt-4 max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg" style={{ animationDelay: "0.3s" }}>
            AutoFlow brings orchestration, observability, and security to every automation framework so teams ship confidently at scale.
          </p>
          <div className="stagger mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.4s" }}>
            <Link href={`${appUrl}/register`} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
              Start free trial
            </Link>
            <Link href="#showcase" className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
              View demo
            </Link>
          </div>
          <div className="stagger mt-12 w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.5)]" style={{ animationDelay: "0.5s" }}>
            <div className="rounded-2xl border border-[rgba(0,229,255,0.12)] bg-[var(--surface-2)] p-4">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
                alt="AutoFlow dashboard preview"
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 800px"
                className="h-auto w-full rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section id="stats" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <div className="glass-card reveal grid gap-4 rounded-2xl px-5 py-5 text-center sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <p className="text-2xl font-semibold text-white">{formattedCounts[index]}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--dim-foreground)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Features</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Everything your QA org needs</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">From setup to rollout, AutoFlow handles the full pipeline with enterprise-grade controls.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card reveal group relative overflow-hidden rounded-2xl p-6"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-[rgba(0,229,255,0.1)] to-[rgba(124,58,237,0.14)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="icon-tile mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ color: feature.accent }}>
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{feature.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="showcase" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal grid gap-10 lg:grid-cols-[1.1fr,1fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Code Showcase</p>
              <h2 className="text-3xl font-semibold sm:text-4xl">A pipeline your team can read</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                Define flows in a single config. AutoFlow handles orchestration, retries, and observability for you.
              </p>
              <div className="glass-card mt-6 w-full max-w-[360px] overflow-hidden rounded-2xl border border-[var(--border)] sm:max-w-[420px] lg:ml-auto">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80"
                  alt="Team reviewing pipeline diagnostics"
                  width={1400}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="h-auto w-full object-cover opacity-55"
                />
              </div>
              <Link href={`${appUrl}/register`} className="btn-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold">
                Get the SDK
              </Link>
              <div className="glass-card mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
                <Image
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
                  alt="Automation workflow overview"
                  width={1400}
                  height={900}
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="h-auto w-full object-cover opacity-60"
                />
              </div>
            </div>
            <div className="code-card reveal rounded-2xl p-6">
              <div className="flex items-center justify-between text-xs text-[var(--dim-foreground)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                  <span className="h-2 w-2 rounded-full bg-[#facc15]" />
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                </div>
                <span>pipeline.ts</span>
              </div>
              <pre className="mt-6 whitespace-pre-wrap text-xs leading-6 text-[var(--muted-foreground)]">
                <code>
                  <span style={{ color: "#00e5ff" }}>import</span> <span style={{ color: "#e8f4fd" }}>{"{"} pipeline, stage {"}"}</span> <span style={{ color: "#00e5ff" }}>from</span> <span style={{ color: "#7c3aed" }}>"@autoflow/core"</span>;
                  {"\n\n"}
                  <span style={{ color: "#00e5ff" }}>export</span> <span style={{ color: "#e8f4fd" }}>const</span> <span style={{ color: "#f97316" }}>releaseFlow</span> = pipeline({"("}
                  {"\n  name: "}<span style={{ color: "#7c3aed" }}>"checkout-release"</span>,
                  {"\n  triggers: ["}<span style={{ color: "#7c3aed" }}>"push"</span>{"],"}
                  {"\n  stages: ["}
                  {"\n    stage("}<span style={{ color: "#7c3aed" }}>"lint"</span>{", { runner: "}<span style={{ color: "#7c3aed" }}>"node"</span>{" })"}
                  {"\n    stage("}<span style={{ color: "#7c3aed" }}>"e2e"</span>{", { parallelism: 12 })"}
                  {"\n    stage("}<span style={{ color: "#7c3aed" }}>"report"</span>{", { notify: true })"}
                  {"\n  ]"}
                  {"\n});"}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section id="pipeline" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Pipeline Visualizer</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">A release flow that never stalls</h2>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {pipelineSteps.map((step, index) => (
              <div key={step.name} className="flex items-center gap-4">
                <div className={`step-card glass-card w-[200px] rounded-2xl p-4 text-left ${activeStep === index ? "active" : ""}`}>
                  <p className="text-2xl">{step.icon}</p>
                  <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">{step.name}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{step.description}</p>
                </div>
                {index < pipelineSteps.length - 1 ? (
                  <span className="hidden text-xl text-[var(--dim-foreground)] md:inline">➜</span>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section id="integrations" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Integrations</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Connect to everything you already use</h2>
          </div>
          <div className="reveal glass-card mx-auto mt-8 max-w-5xl overflow-hidden rounded-3xl border border-[var(--border)]">
            <Image
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80"
              alt="Integrations wall"
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 1040px"
              className="h-auto w-full object-cover opacity-45"
            />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {integrations.map((item) => (
              <span key={item} className="integration-pill rounded-full px-4 py-2 text-[11px] font-semibold">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Pricing</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Plans that scale with your team</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pricing.map((plan) => (
              <div key={plan.tier} className={`pricing-card glass-card reveal rounded-2xl p-6 ${plan.featured ? "featured" : ""}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{plan.tier}</p>
                  {plan.featured ? (
                    <span className="rounded-full bg-[rgba(0,229,255,0.15)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00e5ff]">Most popular</span>
                  ) : null}
                </div>
                <p className="mt-4 text-3xl font-semibold text-[var(--foreground)]">{plan.price}</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{plan.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted-foreground)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-[#00e5ff]">✔</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`${appUrl}/register`} className="btn-secondary mt-6 inline-flex w-full justify-center rounded-full px-4 py-2 text-xs font-semibold">
                  Choose plan
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <div className="reveal glass-card relative overflow-hidden rounded-3xl px-8 py-12 text-center">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
                alt="Glowing server racks"
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 1040px"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              <span className="bg-gradient-to-r from-[#00e5ff] via-[#7c3aed] to-[#f97316] bg-clip-text text-transparent">
                Ready to automate?
              </span>
            </h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Start free today and ship faster with a pipeline your team trusts.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={`${appUrl}/register`} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">Start free</Link>
              <Link href="#showcase" className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">See it in action</Link>
            </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-[var(--dim-foreground)] sm:flex-row sm:px-6">
          <span className="font-semibold text-[var(--muted-foreground)]">⚡ AutoFlow</span>
          <span>© 2026 AutoFlow. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[var(--foreground)]">Privacy</Link>
            <Link href="#" className="hover:text-[var(--foreground)]">Terms</Link>
            <Link href="#" className="hover:text-[var(--foreground)]">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
