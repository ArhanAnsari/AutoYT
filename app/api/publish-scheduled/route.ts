import { NextRequest, NextResponse } from "next/server";
import { uploadVideoToYouTube, getYouTubeClient } from "@/lib/youtube";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import fs from "fs";
import path from "path";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Publish scheduled videos that are ready to go live
 * This can be called by a cron job or triggered manually
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET || "dev-secret-token";

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { channelId } = await req.json();
    if (!channelId) {
      return NextResponse.json(
        { error: "Missing channelId" },
        { status: 400 }
      );
    }

    // Get scheduled videos ready to publish
    const scheduledVideos = await convex.query(api.videos.getScheduledVideosReadyToPublish, {
      channelId: channelId as any,
    });

    if (scheduledVideos.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No scheduled videos ready to publish",
        published: [],
      });
    }

    // Get channel data
    const channel = await convex.query(api.users.getUserChannel, {
      userId: (scheduledVideos[0] as any).userId,
    });

    if (!channel || !channel.youtubeAuthToken) {
      return NextResponse.json(
        { error: "YouTube not connected for this channel" },
        { status: 400 }
      );
    }

    const published = [];
    const youtube = getYouTubeClient(channel.youtubeAuthToken, channel.youtubeRefreshToken);

    for (const video of scheduledVideos) {
      try {
        // Get video details
        const videoDetails = await convex.query(api.videos.getVideoWithScenes, {
          videoId: video._id,
        });

        if (!videoDetails) {
          console.error(`Video ${video._id} not found`);
          continue;
        }

        // Get the video file path (from rendering output)
        const videoFilePath = path.join(
          process.cwd(),
          "public",
          "videos",
          `${video._id}.mp4`
        );

        // Check if file exists
        if (!fs.existsSync(videoFilePath)) {
          console.error(`Video file not found: ${videoFilePath}`);
          // Mark as error
          await convex.mutation(api.videos.updateVideoStatus, {
            videoId: video._id,
            status: "error",
          });
          continue;
        }

        // Update status to "publishing"
        await convex.mutation(api.videos.updateVideoStatus, {
          videoId: video._id,
          status: "publishing",
        });

        // Upload to YouTube
        const videoStream = fs.createReadStream(videoFilePath);
        const uploadedVideo = await uploadVideoToYouTube({
          accessToken: channel.youtubeAuthToken,
          refreshToken: channel.youtubeRefreshToken,
          videoStream,
          title: videoDetails.title,
          description: videoDetails.description || "",
          tags: videoDetails.description?.split(",").map((t: string) => t.trim()) || [],
          categoryId: "22", // People & Blogs
        });

        if (!uploadedVideo.id) {
          throw new Error("Failed to get video ID from YouTube");
        }

        // Mark as published
        await convex.mutation(api.videos.markVideoAsPublished, {
          videoId: video._id,
          youtubeVideoId: uploadedVideo.id,
          publishedUrl: `https://www.youtube.com/watch?v=${uploadedVideo.id}`,
        });

        published.push({
          videoId: video._id,
          youtubeVideoId: uploadedVideo.id,
          url: `https://www.youtube.com/watch?v=${uploadedVideo.id}`,
        });

        console.log(`Published video: ${video.title} (${uploadedVideo.id})`);
      } catch (error) {
        console.error(`Error publishing video ${video._id}:`, error);
        await convex.mutation(api.videos.updateVideoStatus, {
          videoId: video._id,
          status: "error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      published,
      count: published.length,
    });
  } catch (error) {
    console.error("Publish scheduled videos error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publishing failed" },
      { status: 500 }
    );
  }
}
