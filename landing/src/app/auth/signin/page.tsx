import { AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { GitHubSignInButton } from "@/components/auth/GitHubSignInButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const errorMessages: Record<string, string> = {
  AccessDenied: "Access denied. Please try again or use a different account.",
  Configuration: "Authentication provider is not configured correctly.",
  EmailNotAvailable: "Your GitHub account does not expose an email address.",
  OAuthAccountNotLinked: "This account is already linked to another provider.",
  OAuthCallbackError: "OAuth callback failed. Please retry.",
  OAuthCreateAccount: "Could not create account from OAuth profile.",
  OAuthSignin: "GitHub sign-in failed. Please try again.",
  SessionRequired: "Please sign in to continue."
};

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const errorText = params.error ? errorMessages[params.error] || "Authentication failed. Please try again." : "";

  return (
    <div className="min-h-screen surface-gradient">
      <Navbar />
      <main className="px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <Card className="p-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Sign in to AutoForge AI</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Choose a provider to continue securely.
            </p>

            {errorText ? (
              <div className="mt-4 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <span>{errorText}</span>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              <GoogleSignInButton
                className="w-full"
                callbackUrl={params.callbackUrl || "/dashboard"}
                label="Continue with Google"
              />
              <GitHubSignInButton
                className="w-full"
                callbackUrl={params.callbackUrl || "/dashboard"}
                label="Continue with GitHub"
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
