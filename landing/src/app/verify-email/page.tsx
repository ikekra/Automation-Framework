"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

const getTokenFromUrl = () => {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  return params.get("token") || "";
};

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Verifying your email...");
  const token = useMemo(() => getTokenFromUrl(), []);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    let isActive = true;
    setStatus("loading");

    fetch(`${apiBaseUrl}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(payload?.message || "Verification failed.");
        }
        return payload;
      })
      .then(() => {
        if (!isActive) return;
        setStatus("success");
        setMessage("Your email has been verified. You can sign in now.");
        setTimeout(() => {
          router.push(`${appUrl}/login`);
        }, 1500);
      })
      .catch((error) => {
        if (!isActive) return;
        setStatus("error");
        setMessage(error?.message || "Verification failed.");
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-4 py-16">
      <div className="w-full rounded-2xl border border-[#d6e1f2] bg-white p-8 shadow-sm dark:border-[#223049] dark:bg-[#121827]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b73] dark:text-[#7bc6ff]">Email Verification</p>
        <h1 className="mt-3 text-3xl font-semibold">Verify your email</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{message}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`${appUrl}/login`} className={cn(buttonVariants({}), "min-w-[160px]")}>
            Go to sign in
          </Link>
          {status === "error" ? (
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Back to home
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
