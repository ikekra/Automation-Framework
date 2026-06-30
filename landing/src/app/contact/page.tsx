"use client";

import type { FormEvent } from "react";
import Link from "next/link";

const contactEmail = "workforiris78@gmail.com";
const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

export default function ContactPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const topic = formData.get("topic");
    const message = formData.get("message");
    const subject = "AutoForge Inquiry - " + (name || "New Contact");
    const bodyLines = [
      "Hi,",
      "",
      "I'm reaching out about " + (topic || "the product or a demo") + ".",
      "",
      message || "",
      "",
      "Thanks,",
      name || ""
    ];
    const body = bodyLines.join("\n").trim();
    const mailto =
      "mailto:" +
      contactEmail +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    window.location.href = mailto;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid-overlay" aria-hidden="true" />
      <div className="orb cyan" style={{ width: 320, height: 320, top: "-140px", left: "-120px" }} />
      <div className="orb purple" style={{ width: 360, height: 360, bottom: "-180px", right: "-120px" }} />

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:rgba(255,255,255,0.8)] backdrop-blur dark:bg-[color:rgba(6,10,16,0.8)]">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
            >
              AutoForge
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="btn-secondary rounded-full px-4 py-2 text-xs font-semibold">
              Back to landing
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16 sm:px-6">
        <section className="glass-card rounded-3xl px-8 py-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--dim-foreground)]">Contact</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Talk to us about the product, rollout, or a live demo</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
            AutoForge is positioned as a commercial-style automation workspace. Use this page for product questions,
            implementation conversations, or partnership-style outreach.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--dim-foreground)]">
                Name
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--foreground)]"
                />
              </label>
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--dim-foreground)]">
                Topic
                <input
                  name="topic"
                  type="text"
                  placeholder="Demo / Pricing / Partnership / Setup"
                  autoComplete="organization-title"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--foreground)]"
                />
              </label>
            </div>
            <label className="text-xs uppercase tracking-[0.2em] text-[var(--dim-foreground)]">
              Message
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us what you want to discuss"
                autoComplete="off"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--foreground)]"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
                Open email draft
              </button>
              <a href={`mailto:${contactEmail}`} className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
                Direct email
              </a>
              <a href={`${appUrl}/register`} className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
                Create workspace
              </a>
            </div>
            <p className="text-xs text-[var(--dim-foreground)]">
              Draft opens in your email app. Nothing is sent automatically. Typical response time: 1-2 business days.
            </p>
          </form>
          <p className="mt-4 text-xs text-[var(--dim-foreground)]">{contactEmail}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-3xl px-6 py-8">
            <h2 className="text-lg font-semibold">Best fit conversations</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--muted-foreground)]">
              <li>Implementation planning for QA automation teams</li>
              <li>Demo walkthroughs of framework generation and analysis</li>
              <li>Product feedback, collaboration, or pilot-style usage</li>
            </ul>
          </div>
          <div className="glass-card rounded-3xl px-6 py-8">
            <h2 className="text-lg font-semibold">Inside the app</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--muted-foreground)]">
              <li>JWT-based account system connected to the backend</li>
              <li>Framework generation with account-backed history</li>
              <li>Web app analysis, diagnostics, and downloadable output</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
