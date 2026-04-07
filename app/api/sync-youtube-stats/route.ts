import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getYouTubeClient } from "@/lib/youtube";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Fetches YouTube channel stats and syncs video metrics
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId" },
        { status: 400 }
      );
    }

    // Get user and channel
    const user = await convex.query(api.users.getUser, { email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const channel = await convex.query(api.users.getUserChannel, { userId: user._id });
    if (!channel || !channel.youtubeAuthToken) {
      return NextResponse.json(
        { error: "YouTube not connected" },
        { status: 400 }
      );
    }

    // Get video data from Convex
    const videoData = await convex.query(api.videos.getVideoWithScenes, { videoId: videoId as any });
    if (!videoData || !videoData.youtubeVideoId) {
      return NextResponse.json(
        { error: "Video not found or not yet published" },
        { status: 404 }
      );
    }

    // Get YouTube stats
    const youtube = getYouTubeClient(channel.youtubeAuthToken, channel.youtubeRefreshToken);

    const statsResponse = await youtube.videos.list({
      part: ["statistics"],
      id: [videoData.youtubeVideoId],
    });

    if (!statsResponse.data.items || statsResponse.data.items.length === 0) {
      return NextResponse.json(
        { error: "Video not found on YouTube" },
        { status: 404 }
      );
    }

    const stats = statsResponse.data.items[0].statistics;
    const views = parseInt(stats?.viewCount || "0", 10);
    const likes = parseInt(stats?.likeCount || "0", 10);
    const comments = parseInt(stats?.commentCount || "0", 10);

    // Update metrics in Convex
    await convex.mutation(api.videos.updateVideoMetrics, {
      videoId: videoId as any,
      views,
      likes,
      comments,
    });

    return NextResponse.json({
      success: true,
      metrics: {
        views,
        likes,
        comments,
      },
    });
  } catch (error) {
    console.error("YouTube sync error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
