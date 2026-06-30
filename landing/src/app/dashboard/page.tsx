import { redirect } from "next/navigation";

export default function DashboardPage() {
  const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";
  redirect(`${appUrl}/dashboard`);
}
