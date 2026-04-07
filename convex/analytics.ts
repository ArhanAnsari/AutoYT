import { query } from "./_generated/server";
import { v } from "convex/values";

export const getChannelAnalytics = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .collect();

    const totalVideos = videos.length;
    const publishedVideos = videos.filter((v) => v.status === "published");
    const scheduledVideos = videos.filter((v) => v.status === "scheduled");
    const draftVideos = videos.filter(
      (v) => ["idea", "scripting", "generating_assets", "rendering", "ready"].includes(v.status)
    );

    const totalViews = publishedVideos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalLikes = publishedVideos.reduce((sum, v) => sum + (v.likes || 0), 0);
    const totalComments = publishedVideos.reduce((sum, v) => sum + (v.comments || 0), 0);
    const avgViews = publishedVideos.length > 0 ? totalViews / publishedVideos.length : 0;

    return {
      totalVideos,
      publishedVideos: publishedVideos.length,
      scheduledVideos: scheduledVideos.length,
      draftVideos: draftVideos.length,
      totalViews,
      totalLikes,
      totalComments,
      avgViews: Math.round(avgViews),
      engagementRate:
        totalViews > 0
          ? Math.round(((totalLikes + totalComments) / totalViews) * 100)
          : 0,
    };
  },
});

export const getVideoMetrics = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.videoId);
    if (!video) return null;

    return {
      title: video.title,
      status: video.status,
      views: video.views || 0,
      likes: video.likes || 0,
      comments: video.comments || 0,
      publishedAt: video.publishedAtActual,
      youtubeUrl: video.publishedUrl,
      engagementRate:
        (video.views || 0) > 0
          ? Math.round((((video.likes || 0) + (video.comments || 0)) / (video.views || 1)) * 100)
          : 0,
    };
  },
});

export const getUpcomingPublications = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .filter((q) => q.and(q.eq(q.field("status"), "scheduled"), q.gt(q.field("publishedAt"), now)))
      .order("asc")
      .collect();

    return videos.map((v) => ({
      id: v._id,
      title: v.title,
      scheduledAt: v.publishedAt,
      status: v.status,
    }));
  },
});
