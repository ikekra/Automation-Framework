"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const SignOutButton = ({ className }: { className?: string }) => {
  return (
    <Button type="button" variant="secondary" className={className} onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};
