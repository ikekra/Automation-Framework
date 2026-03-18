"use client";

import Link from "next/link";

const contactEmail = "workforiris78@gmail.com";

export default function ContactPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const role = formData.get("role");
    const message = formData.get("message");
    const subject = "Internship / Junior Role - " + (name || "Prospective Employer");
    const bodyLines = [
      "Hi,",
      "",
      "I'm interested in " + (role || "internship or junior") + " opportunities.",
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
              ⚡ AutoFlow
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
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Open to internships & junior roles</h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
            I'm a student building automation tools and UI systems. If this demo looks useful, I'd love to connect about
            internship or junior developer roles.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--dim-foreground)]">
                Name
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--foreground)]"
                />
              </label>
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--dim-foreground)]">
                Role Type
                <input
                  name="role"
                  type="text"
                  placeholder="Internship / Junior / Contract"
                  className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--foreground)]"
                />
              </label>
            </div>
            <label className="text-xs uppercase tracking-[0.2em] text-[var(--dim-foreground)]">
              Message
              <textarea
                name="message"
                rows={5}
                placeholder="Tell me about the role or team"
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
              <Link href="/" className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold">
                Back to demo
              </Link>
            </div>
            <p className="text-xs text-[var(--dim-foreground)]">Draft opens in your email app. Nothing is sent automatically.</p>
          </form>
          <p className="mt-4 text-xs text-[var(--dim-foreground)]">{contactEmail}</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-3xl px-6 py-8">
            <h2 className="text-lg font-semibold">What this project shows</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--muted-foreground)]">
              <li>Clean, readable automation configs</li>
              <li>Thoughtful UI details and hierarchy</li>
              <li>Practical observability concepts</li>
            </ul>
          </div>
          <div className="glass-card rounded-3xl px-6 py-8">
            <h2 className="text-lg font-semibold">Looking for</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--muted-foreground)]">
              <li>Internship or junior developer roles</li>
              <li>Frontend or automation tooling teams</li>
              <li>Mentorship and constructive feedback</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
