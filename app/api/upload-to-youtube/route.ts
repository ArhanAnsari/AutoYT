import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadVideoToYouTube, getYouTubeClient } from "@/lib/youtube";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import path from "path";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const videoId = formData.get("videoId") as string;
    const videoFile = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.getAll("tags") as string[];
    const categoryId = (formData.get("categoryId") as string) || "22"; // Default: People & Blogs

    if (!videoId || !videoFile || !title) {
      return NextResponse.json(
        { error: "Missing required fields: videoId, video file, or title" },
        { status: 400 }
      );
    }

    // Get user data from Convex
    const user = await convex.query(api.users.getUser, { email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get channel data
    const channel = await convex.query(api.users.getUserChannel, { userId: user._id });
    if (!channel || !channel.youtubeAuthToken) {
      return NextResponse.json(
        { error: "YouTube not connected" },
        { status: 400 }
      );
    }

    // Convert video file to stream
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to YouTube
    const uploadedVideo = await uploadVideoToYouTube({
      accessToken: channel.youtubeAuthToken,
      refreshToken: channel.youtubeRefreshToken,
      videoStream: require("stream").Readable.from([buffer]),
      title,
      description: description || "",
      tags,
      categoryId,
    });

    if (!uploadedVideo.id) {
      throw new Error("Failed to get video ID from YouTube");
    }

    // Mark video as published in Convex
    await convex.mutation(api.videos.markVideoAsPublished, {
      videoId: videoId as any,
      youtubeVideoId: uploadedVideo.id,
      publishedUrl: `https://www.youtube.com/watch?v=${uploadedVideo.id}`,
    });

    return NextResponse.json({
      success: true,
      youtubeVideoId: uploadedVideo.id,
      publishedUrl: `https://www.youtube.com/watch?v=${uploadedVideo.id}`,
    });
  } catch (error) {
    console.error("YouTube upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
