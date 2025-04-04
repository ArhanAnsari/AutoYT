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
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return "/generate"; // Redirect all successful logins to /generate
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
