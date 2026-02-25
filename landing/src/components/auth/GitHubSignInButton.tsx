"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

type Props = {
  callbackUrl?: string;
  className?: string;
  label?: string;
  variant?: "default" | "secondary" | "ghost";
};

export const GitHubSignInButton = ({
  callbackUrl = "/dashboard",
  className,
  label = "Continue with GitHub",
  variant = "secondary"
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      await signIn("github", { callbackUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={loading}
      aria-label="Continue with GitHub"
    >
      <Github className="mr-2 h-4 w-4" />
      {loading ? "Redirecting..." : label}
    </Button>
  );
};
