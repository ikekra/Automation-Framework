import type { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";

const getEnv = (key: string, fallbackKey?: string) => {
  const direct = process.env[key]?.trim();
  if (direct) {
    return direct;
  }

  if (fallbackKey) {
    const fallback = process.env[fallbackKey]?.trim();
    if (fallback) {
      return fallback;
    }
  }

  return "";
};

const adminEmails = new Set(
  (process.env.AUTH_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const resolveRole = (email?: string | null) => {
  if (!email) {
    return "user" as const;
  }

  return adminEmails.has(email.toLowerCase()) ? ("admin" as const) : ("user" as const);
};

export const authOptions: NextAuthOptions = {
  secret: getEnv("AUTH_SECRET", "NEXTAUTH_SECRET"),
  providers: [
    GitHub({
      clientId: getEnv("AUTH_GITHUB_ID", "GITHUB_ID"),
      clientSecret: getEnv("AUTH_GITHUB_SECRET", "GITHUB_SECRET")
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async signIn({ profile }) {
      const email = typeof profile?.email === "string" ? profile.email : null;
      if (!email) {
        return "/auth/signin?error=EmailNotAvailable";
      }

      return true;
    },
    async jwt({ token, profile }) {
      if (profile) {
        const rawProfile = profile as Record<string, unknown>;
        const email = typeof profile.email === "string" ? profile.email : null;
        token.role = resolveRole(email);
        token.username =
          typeof rawProfile.login === "string"
            ? rawProfile.login
            : typeof profile.name === "string"
              ? profile.name
              : token.username;
        token.picture = typeof rawProfile.avatar_url === "string" ? rawProfile.avatar_url : token.picture;
      }

      if (!token.role) {
        token.role = resolveRole(typeof token.email === "string" ? token.email : null);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === "string" ? token.sub : "";
        session.user.role = token.role === "admin" ? "admin" : "user";
        session.user.name = typeof token.name === "string" ? token.name : session.user.name;
        session.user.email = typeof token.email === "string" ? token.email : session.user.email;
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
        session.user.username = typeof token.username === "string" ? token.username : undefined;
      }

      return session;
    }
  }
};
