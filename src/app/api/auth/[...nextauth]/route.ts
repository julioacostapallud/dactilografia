import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Conectar con el backend para validar credenciales
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/validate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            return data.user;
          }

          return null;
        } catch (error) {
          console.error("Error during credentials authorization:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      console.log("=== SESSION CALLBACK ===");
      console.log("Session:", JSON.stringify(session, null, 2));
      console.log("Token:", JSON.stringify(token, null, 2));
      console.log("=======================");
      
      (session as { accessToken?: string }).accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account, profile }) {
      // Custom logic to handle user creation/update in your database
      if (account?.provider === "google") {
        try {
          console.log("=== GOOGLE SIGN IN DATA ===");
          console.log("User:", JSON.stringify(user, null, 2));
          console.log("Account:", JSON.stringify(account, null, 2));
          console.log("Profile:", JSON.stringify(profile, null, 2));
          console.log("==========================");
          
          // Here you can add logic to create/update user in your database
          // For now, we'll just allow the sign in
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
