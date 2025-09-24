import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Demo Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.name) {
          return { id: credentials.email, name: credentials.name, email: credentials.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
};
