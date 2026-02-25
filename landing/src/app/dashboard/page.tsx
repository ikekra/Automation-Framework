import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/config";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?error=SessionRequired&callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen surface-gradient">
      <Navbar />
      <main className="px-4 py-14 sm:px-6">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt={session.user.name || "User avatar"} className="h-11 w-11 rounded-full border border-slate-300 dark:border-slate-700" />
              ) : (
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {(session.user.name || session.user.email || "U").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{session.user.username || session.user.name || session.user.email}</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">Role: {session.user.role === "admin" ? "Admin" : "User"}</p>
              </div>
            </div>

            <SignOutButton />
          </header>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Protected Dashboard</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              This route is guarded by middleware and requires an authenticated GitHub session.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
