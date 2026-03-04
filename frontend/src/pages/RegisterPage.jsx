import { motion as Motion } from "framer-motion";
import { AuthForm } from "../features/auth/components/AuthForm";
import { GlassCard } from "../components/ui/GlassCard";
import { LazyBackgroundImage } from "../components/ui/LazyBackgroundImage";

const authImage =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";

export const RegisterPage = () => {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <GlassCard className="relative w-full max-w-5xl overflow-hidden p-0 md:grid md:grid-cols-[1.1fr,1fr]">
        <div className="relative hidden md:block">
          <LazyBackgroundImage src={authImage} alt="Abstract tech network" className="h-full w-full object-cover" priority />
          <div className="absolute inset-0 bg-slate-950/35" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">Get Started</p>
            <h2 className="mt-2 text-2xl font-bold">Create an account and generate faster.</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-100/90">
              <li>Verify email to activate your workspace</li>
              <li>Save generation history automatically</li>
              <li>Access security controls in Profile</li>
            </ul>
          </div>
        </div>

        <Motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-6 sm:p-8"
        >
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Start generating frameworks in your workspace.</p>

          <div className="mt-4 rounded-2xl border border-white/20 bg-white/50 p-3 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
            You’ll receive a verification email before your first login.
          </div>

          <div className="mt-6">
            <AuthForm mode="register" />
          </div>
        </Motion.section>
      </GlassCard>
    </main>
  );
};
