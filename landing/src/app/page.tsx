"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "SDK", href: "#showcase" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Integrations", href: "#integrations" },
  { label: "Contact", href: "/contact" }
];

const features = [
  {
    title: "Zero-config setup",
    description: "Spin up pipelines with a single config file and opinionated defaults.",
    accent: "var(--primary)",
    icon: "⚡"
  },
  {
    title: "AI orchestration",
    description: "Adaptive retries and smart parallelism keep your suites fast and reliable.",
    accent: "var(--secondary)",
    icon: "🧠"
  },
  {
    title: "Parallel execution",
    description: "Distribute workloads across runners with autoscaling and adaptive queues.",
    accent: "var(--tertiary)",
    icon: "🧩"
  },
  {
    title: "Universal connectors",
    description: "Plug into CI/CD, cloud, and observability stacks without custom glue code.",
    accent: "var(--primary)",
    icon: "🔌"
  },
  {
    title: "Real-time observability",
    description: "Track latency, flakiness, and failures with live diagnostics and traces.",
    accent: "var(--secondary)",
    icon: "📡"
  },
  {
    title: "Enterprise security",
    description: "SSO, SOC-ready controls, and hardened scanning baked in by default.",
    accent: "var(--tertiary)",
    icon: "🛡️"
  }
];

const pipelineSteps = [
  {
    name: "Define",
    description: "Model suites with clear ownership and intent.",
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
    description: "Trace every signal with live diagnostics.",
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

const stats = [
  { label: "Pipelines modeled", value: "120+", tone: "var(--primary)" },
  { label: "Avg. build speedup", value: "3.4x", tone: "var(--secondary)" },
  { label: "SDK tests covered", value: "96%", tone: "var(--tertiary)" }
];

const contactEmail = "workforiris78@gmail.com";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const activeStep = 0;

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

  const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-[var(--surface)] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[var(--foreground)]"
      >
        Skip to main content
      </a>
      <div className="grid-overlay" aria-hidden="true" />
      <div className="orb cyan" style={{ width: 360, height: 360, top: "-120px", left: "-120px" }} />
      <div className="orb purple" style={{ width: 420, height: 420, top: "20%", right: "-180px" }} />
      <div className="orb blue" style={{ width: 360, height: 360, bottom: "-140px", left: "30%" }} />

      <header className="nav-load sticky top-0 z-30 border-b border-[var(--border)] bg-[color:rgba(7,11,18,0.78)] backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
            >
              ⚡ AutoFlow
            </span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-[var(--muted-foreground)] md:flex">
            {navLinks.map((link) => (
              link.href.startsWith("#") ? (
                <a key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]">
                  {link.label}
                </Link>
              )
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href={`${appUrl}/login`} className="btn-secondary rounded-full px-4 py-2.5 text-xs font-semibold">
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
                link.href.startsWith("#") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="transition hover:text-[var(--foreground)]"
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition hover:text-[var(--foreground)]"
                    onClick={() => setNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main id="main-content">
        <section className="mx-auto flex min-h-[90vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <div className="stagger section-label" style={{ animationDelay: "0.1s" }}>
            <span className="badge-dot" />
            Student-built · Deploy-ready
          </div>
          <h1 className="stagger mt-6 text-4xl font-extrabold sm:text-6xl" style={{ animationDelay: "0.2s" }}>
            Automation you can
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--primary), var(--secondary), var(--tertiary))" }}
            >
              trust and ship.
            </span>
          </h1>
          <p className="stagger mt-4 max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg" style={{ animationDelay: "0.3s" }}>
            AutoFlow is a student-built automation framework demo. I’m sharing it to showcase my work and connect with
            internship or junior developer teams.
          </p>
          <div className="stagger mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.4s" }}>
            <Link href={`${appUrl}/register`} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
              Explore the app
            </Link>
            <Link href="#showcase" className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
              View demo
            </Link>
            <a href={`mailto:${contactEmail}`} className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
              Contact me
            </a>
          </div>
          <div className="stagger mt-8 grid w-full max-w-5xl gap-4 sm:grid-cols-3" style={{ animationDelay: "0.5s" }}>
            {stats.map((item) => (
              <div key={item.label} className="stat-card text-left">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--dim-foreground)]">{item.label}</p>
                <p className="mt-2 text-2xl font-bold" style={{ color: item.tone }}>
                  {item.value}
                </p>
              </div>
            ))}
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

        <section id="features" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal text-center">
            <span className="section-label">Features</span>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">What I focused on building</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">The kind of fundamentals I’d bring to a junior or internship role.</p>
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
                Define flows in one config. AutoFlow handles orchestration, retries, and observability while keeping the logic approachable.
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
                View the SDK
              </Link>
            </div>
            <div className="code-card reveal rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-[var(--dim-foreground)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                  <span className="h-2 w-2 rounded-full bg-[#facc15]" />
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                </div>
                <span>pipeline.ts</span>
              </div>
              <pre className="mt-6 whitespace-pre-wrap text-[11px] leading-6 text-[var(--muted-foreground)]">
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
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Release flow with clear ownership</h2>
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
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Connect to the stack you already use</h2>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {integrations.map((item) => (
              <span key={item} className="integration-pill rounded-full px-4 py-2 text-[11px] font-semibold">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <div className="reveal glass-card flex flex-col items-center justify-between gap-6 rounded-3xl px-8 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Contact</p>
              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Looking for internships or junior roles</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                If you’re hiring students, I’d love to connect and share more work.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
              <Link href="/contact" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
                Contact page
              </Link>
              <a href={`mailto:${contactEmail}`} className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
                Email me
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-[var(--dim-foreground)] sm:flex-row sm:px-6">
          <span className="font-semibold text-[var(--muted-foreground)]">⚡ AutoFlow</span>
          <span>© 2026 AutoFlow</span>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-[var(--foreground)]">Contact</Link>
            <Link href="#" className="hover:text-[var(--foreground)]">Privacy</Link>
            <Link href="#" className="hover:text-[var(--foreground)]">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
