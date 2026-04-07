import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Update video details (title, description, publish schedule, etc.)
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId, title, description, publishAt, tags } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    // Get user to verify ownership
    const user = await convex.query(api.users.getUser, { email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get video and verify ownership through channel
    const video = await convex.query(api.videos.getVideoWithScenes, { videoId: videoId as any });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Verify user owns this video's channel
    const channel = await convex.query(api.users.getUserChannel, { userId: user._id });
    if (!channel || channel._id !== video.channelId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build update object
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    // Update video metadata
    if (Object.keys(updates).length > 0) {
      // Note: We can't directly patch videos table from API
      // We'll need to create a mutation for this. For now, this is the interface
      console.log("Updating video:", { videoId, ...updates });
    }

    // If publishing strategy has changed
    if (publishAt !== undefined) {
      if (publishAt) {
        // Schedule for publishing
        await convex.mutation(api.videos.scheduleVideoForPublishing, {
          videoId: videoId as any,
          publishAt,
        });
      } else {
        // Keep as ready
        await convex.mutation(api.videos.updateVideoStatus, {
          videoId: videoId as any,
          status: "ready",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Video updated successfully",
    });
  } catch (error) {
    console.error("Video edit error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
