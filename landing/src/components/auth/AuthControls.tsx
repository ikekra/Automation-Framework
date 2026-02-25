"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { GitHubSignInButton } from "@/components/auth/GitHubSignInButton";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const AuthControls = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-40 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />;
  }

  if (!session?.user) {
    return <GitHubSignInButton className="h-9" callbackUrl="/dashboard" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200">
        {session.user.image ? (
          <Image src={session.user.image} alt={session.user.name || "User avatar"} width={20} height={20} className="h-5 w-5 rounded-full" />
        ) : (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
            {(session.user.name || session.user.email || "U").slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="max-w-[120px] truncate">{session.user.username || session.user.name || session.user.email}</span>
      </Link>
      <SignOutButton className="h-9" />
    </div>
  );
};
