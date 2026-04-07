import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: "user" | "admin";
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "user" | "admin";
    username?: string;
  }
}
