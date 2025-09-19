import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth credentials");
}

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MongoDB URI");
}

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                token.accessToken = account.access_token;
                token.role = user.role || "renter"; // Default role
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.role = token.role as "renter" | "host";
                session.accessToken = token.accessToken as string;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    // Call your backend to create/update user
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            googleId: user.id,
                            email: user.email,
                            name: user.name,
                            avatar: user.image,
                            role: "renter", // Default role, can be changed later
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            user.role = data.data.user.role;
                            return true;
                        }
                    }
                    return false;
                } catch (error) {
                    console.error("Google sign-in error:", error);
                    return false;
                }
            }
            return true;
        },
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
