import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return "/generate";
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
