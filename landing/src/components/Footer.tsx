import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="border-t border-slate-200/80 bg-white/80 py-14 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">AutoForge</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Modern AI-driven web testing for quality teams.</p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm" aria-label="Footer">
          <Link href="#home" className="text-slate-600 hover:text-[#1f3b73] dark:text-slate-300 dark:hover:text-[#7bc6ff]">Home</Link>
          <Link href="#features" className="text-slate-600 hover:text-[#1f3b73] dark:text-slate-300 dark:hover:text-[#7bc6ff]">Features</Link>
          <Link href="#about" className="text-slate-600 hover:text-[#1f3b73] dark:text-slate-300 dark:hover:text-[#7bc6ff]">About</Link>
          <Link href="#contact" className="text-slate-600 hover:text-[#1f3b73] dark:text-slate-300 dark:hover:text-[#7bc6ff]">Contact</Link>
        </nav>

        <div className="flex items-start justify-start gap-3 md:justify-end">
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 p-2 text-slate-600 hover:border-[#2fb7a0] hover:text-[#1f3b73] dark:border-slate-700 dark:text-slate-300 dark:hover:border-[#2fb7a0] dark:hover:text-[#7bc6ff]">
            <Github className="h-4 w-4" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 p-2 text-slate-600 hover:border-[#2fb7a0] hover:text-[#1f3b73] dark:border-slate-700 dark:text-slate-300 dark:hover:border-[#2fb7a0] dark:hover:text-[#7bc6ff]">
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link href="https://x.com" target="_blank" rel="noreferrer" className="rounded-md border border-slate-300 p-2 text-slate-600 hover:border-[#2fb7a0] hover:text-[#1f3b73] dark:border-slate-700 dark:text-slate-300 dark:hover:border-[#2fb7a0] dark:hover:text-[#7bc6ff]">
            <Twitter className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-10 w-full max-w-6xl px-4 text-sm text-slate-500 sm:px-6 dark:text-slate-400">
        &copy; {new Date().getFullYear()} AutoForge. All rights reserved.
      </p>
    </footer>
  );
};
