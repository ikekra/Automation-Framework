import { NextResponse, type NextRequest } from "next/server";

const appUrl = process.env.NEXT_PUBLIC_FRONTEND_APP_URL || "http://localhost:5173";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
    return NextResponse.redirect(`${appUrl}${path}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
