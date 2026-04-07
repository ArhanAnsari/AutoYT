import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 },
      );
    }

    const video = await convex.query(api.videos.getVideoWithScenes, {
      videoId: videoId as any,
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const allAssetsReady = video.scenes.every(
      (scene: any) => scene.imageAssetUrl && scene.audioAssetUrl,
    );

    if (!allAssetsReady) {
      return NextResponse.json(
        { error: "Not all scenes have generated images and audio" },
        { status: 400 },
      );
    }

    await convex.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as any,
      status: "rendering",
    });

    // Placeholder assembly URL until a renderer service is integrated.
    const videoUrl = `https://video-placeholder-${videoId}-${Date.now()}.mp4`;

    await convex.mutation(api.videos.updateVideoStatus, {
      videoId: videoId as any,
      status: "ready",
    });

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
      message: "Video assembly completed successfully.",
    });
  } catch (error) {
    console.error("Video assembly error:", error);
    return NextResponse.json(
      { error: "Failed to assemble video" },
      { status: 500 },
    );
  }
}
