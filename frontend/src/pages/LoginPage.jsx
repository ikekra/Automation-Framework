import { motion } from "framer-motion";
import { AuthForm } from "../features/auth/components/AuthForm";

export const LoginPage = () => {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="card w-full max-w-md p-6 sm:p-8"
      >
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to continue building frameworks.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
      </motion.section>
    </main>
  );
};
