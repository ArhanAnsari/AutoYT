import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getYouTubeClient } from "@/lib/youtube";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/youtube.upload",
            "https://www.googleapis.com/auth/youtube.readonly",
          ].join(" "),
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user.email && account) {
        try {
          // Sync user in Convex
          const userId = await convex.mutation(api.users.syncUser, {
            email: user.email,
          });

          // If we got access tokens, try getting the user's YouTube Channel info
          let channelTitle = "My Channel";
          if (account.access_token) {
            try {
              const yt = getYouTubeClient(account.access_token);
              const ytResponse = await yt.channels.list({ part: ["snippet"], mine: true });
              if (ytResponse.data.items && ytResponse.data.items.length > 0) {
                channelTitle = ytResponse.data.items[0].snippet?.title || "My Channel";
              }
            } catch (err) {
              console.error("Failed to fetch YT channel:", err);
            }
          }

          // Sync Channel in Convex
          await convex.mutation(api.users.syncChannel, {
            userId: userId as any,
            youtubeAuthToken: account.access_token,
            youtubeRefreshToken: account.refresh_token,
            channelTitle: channelTitle,
          });
        } catch (error) {
          console.error("Failed to sync with Convex during sign in:", error);
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      // Also store refresh token so we can save it to Convex or use it server-side to upload videos.
      session.refreshToken = token.refreshToken;
      return session;
    },
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; 
      }
      return token;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return "/dashboard"; // Redirect to new redesign
    },
  }
};
