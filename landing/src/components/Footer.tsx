import Link from "next/link";

export const Footer = () => {
  return (
    <footer id="contact" className="border-t border-slate-200/70 py-12 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 text-sm text-slate-600 sm:px-6 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">AutoForge AI</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">AI-Powered Web Application Testing</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="#features" className="hover:text-slate-900 dark:hover:text-white">Features</Link>
          <Link href="#pricing" className="hover:text-slate-900 dark:hover:text-white">Pricing</Link>
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white">GitHub</Link>
          <Link href="mailto:hello@autoforge.ai" className="hover:text-slate-900 dark:hover:text-white">Contact</Link>
        </div>

        <p className="text-slate-500">(c) {new Date().getFullYear()} AutoForge AI. All rights reserved.</p>
      </div>
    </footer>
  );
};
