"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Workflow", href: "#workflow" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "/contact" }
];

const pillars = [
  {
    title: "Framework generation",
    description: "Compose stack, runner, and CI choices in one guided workspace and generate starter automation projects."
  },
  {
    title: "Account-backed history",
    description: "Keep framework outputs tied to authenticated users with controlled downloads and cleanup actions."
  },
  {
    title: "Runtime diagnostics",
    description: "Analyze web apps for console failures, network issues, exceptions, screenshots, and AI-guided fixes."
  }
];

const workflow = [
  { name: "Configure", description: "Select language, runner, pattern, and delivery options." },
  { name: "Generate", description: "Create project scaffolding and store the output in account history." },
  { name: "Analyze", description: "Run browser-based diagnostics against target apps." },
  { name: "Deliver", description: "Download authenticated bundles and review operational checks." }
];

const faqs = [
  {
    q: "Where is the real product app?",
    a: "The main workspace lives in the Vite frontend app. This landing site is now a marketing and handoff layer."
  },
  {
    q: "How do users access the workspace?",
    a: "Users sign up or sign in through the main app and use JWT-backed auth there for the actual product flow."
  },
  {
    q: "What does the backend handle?",
    a: "It handles auth, framework generation, account history, Playwright analysis, SSRF-safe URL validation, and internal diagnostics."
  },
  {
    q: "Is this deployable?",
    a: "Yes. The apps are already structured for separate frontend, landing, and backend deployment with environment-based configuration."
  }
];

const proof = [
  { label: "Build velocity", value: "3.4x" },
  { label: "Coverage ready", value: "96%" },
  { label: "Download model", value: "Authenticated" }
];

const contactEmail = "workforiris78@gmail.com";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

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
      <div className="orb purple" style={{ width: 420, height: 420, top: "24%", right: "-180px" }} />
      <div className="orb blue" style={{ width: 360, height: 360, bottom: "-140px", left: "30%" }} />

      <header className="nav-load sticky top-0 z-30 border-b border-[var(--border)] bg-[color:rgba(7,11,18,0.78)] backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
            >
              AutoForge
            </span>
          </Link>

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
              App login
            </Link>
            <Link href={`${appUrl}/register`} className="btn-primary rounded-full px-4 py-2.5 text-xs font-semibold">
              Start workspace
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
                  <a key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]" onClick={() => setNavOpen(false)}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="transition hover:text-[var(--foreground)]" onClick={() => setNavOpen(false)}>
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main id="main-content">
        <section className="mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
          <div className="stagger section-label" style={{ animationDelay: "0.1s" }}>
            Commercial-style QA workspace
          </div>
          <h1 className="stagger mt-6 text-4xl font-extrabold sm:text-6xl" style={{ animationDelay: "0.2s" }}>
            Automation operations for
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--primary), var(--secondary), var(--tertiary))" }}
            >
              modern delivery teams.
            </span>
          </h1>
          <p className="stagger mt-4 max-w-3xl text-base text-[var(--muted-foreground)] sm:text-lg" style={{ animationDelay: "0.3s" }}>
            AutoForge combines framework generation, account-backed history, runtime diagnostics, and operational checks
            in one product workspace. The marketing site stays public. The real app begins in the main frontend.
          </p>

          <div className="stagger mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.4s" }}>
            <Link href={`${appUrl}/register`} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
              Open the workspace
            </Link>
            <Link href={`${appUrl}/login`} className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
              Sign in to app
            </Link>
            <a href={`mailto:${contactEmail}`} className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
              Contact
            </a>
          </div>

          <div className="stagger mt-10 grid w-full max-w-5xl gap-4 sm:grid-cols-3" style={{ animationDelay: "0.5s" }}>
            {proof.map((item) => (
              <div key={item.label} className="stat-card text-left">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--dim-foreground)]">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-[var(--foreground)]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="platform" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal text-center">
            <span className="section-label">Platform</span>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">One app for generation, analysis, and delivery</h2>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              The product experience is no longer split across two competing app surfaces.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((item, index) => (
              <div key={item.title} className="glass-card reveal rounded-2xl p-6" style={{ transitionDelay: `${index * 90}ms` }}>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Workflow</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">How the product works now</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((item) => (
              <div key={item.name} className="glass-card reveal rounded-2xl p-5 text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--dim-foreground)]">{item.name}</p>
                <p className="mt-3 text-base font-semibold text-[var(--foreground)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="reveal grid gap-6 lg:grid-cols-[1fr,1fr]">
            <div className="glass-card rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--dim-foreground)]">Access Model</p>
              <h2 className="mt-3 text-2xl font-semibold">Main app owns the real auth flow</h2>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                Users now enter the product through the Vite app for sign up, login, framework history, diagnostics,
                and profile management. The landing site acts as a commercial front door and handoff layer.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--dim-foreground)]">Backend Capabilities</p>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--muted-foreground)]">
                <li>JWT auth with refresh rotation and optional 2FA</li>
                <li>Framework history tied to authenticated users</li>
                <li>Playwright analysis with SSRF-safe URL validation</li>
                <li>Internal self-test diagnostics for operational readiness</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
          <div className="reveal text-center">
            <span className="section-label">FAQ</span>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Clearer product boundaries</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q} className="faq-card reveal">
                <div className="faq-question">
                  <p className="text-base font-semibold text-[var(--foreground)]">{item.q}</p>
                  <span className="text-[var(--primary)]">?</span>
                </div>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <div className="cta-band reveal flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--dim-foreground)]">Start</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Enter the main AutoForge workspace</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Use the real product app for login, generation, history, and diagnostics.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`${appUrl}/register`} className="btn-primary rounded-full px-5 py-3 text-sm font-semibold">
                Create account
              </Link>
              <Link href={`${appUrl}/login`} className="btn-secondary rounded-full px-5 py-3 text-sm font-semibold">
                App login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-[var(--dim-foreground)] sm:flex-row sm:px-6">
          <span className="font-semibold text-[var(--muted-foreground)]">AutoForge</span>
          <span>(c) 2026 AutoForge</span>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-[var(--foreground)]">Contact</Link>
            <Link href={`${appUrl}/login`} className="hover:text-[var(--foreground)]">App login</Link>
            <Link href={`${appUrl}/register`} className="hover:text-[var(--foreground)]">Create account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
