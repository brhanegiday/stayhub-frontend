import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "renter" | "host";
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "renter" | "host";
  }

  interface JWT {
    accessToken?: string;
    role?: "renter" | "host";
  }
}