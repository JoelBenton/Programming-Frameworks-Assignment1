import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Replace with your own API call for authentication
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL_BASE}/api/users/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password,
                        }),
                    },
                );

                const data = await response.json();

                if (response.ok && data) {
                    // If authentication is successful, return the user object
                    return {
                        id: data.id,
                        username: data.username,
                        admin: data.admin,
                        token: data.token,
                    };
                }

                return null; // If authentication fails
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.admin = user.admin;
                token.token = user.token;
            }
            return token;
        },
        // Add user info to the session
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.admin = token.admin as boolean;
            }
            return session;
        },
    },
});
