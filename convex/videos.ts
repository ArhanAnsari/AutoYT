import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createVideo = mutation({
  args: {
    channelId: v.id("channels"),
    title: v.string(),
    description: v.optional(v.string()),
    scenes: v.array(
      v.object({
        order: v.number(),
        narrationText: v.string(),
        imagePrompt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Create the base video record
    const videoId = await ctx.db.insert("videos", {
      channelId: args.channelId,
      title: args.title,
      description: args.description || "",
      status: "scripting",
    });

    // 2. Insert all the scenes
    for (const scene of args.scenes) {
      await ctx.db.insert("scenes", {
        videoId,
        order: scene.order,
        narrationText: scene.narrationText,
        imagePrompt: scene.imagePrompt,
      });
    }

    return videoId;
  },
});

export const getVideoWithScenes = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.videoId);
    if (!video) return null;

    const scenes = await ctx.db
      .query("scenes")
      .withIndex("by_video", (q) => q.eq("videoId", args.videoId))
      .collect();

    // Sort by order correctly
    scenes.sort((a, b) => a.order - b.order);

    return { ...video, scenes };
  },
});

export const updateSceneAsset = mutation({
  args: {
    sceneId: v.id("scenes"),
    imageAssetUrl: v.optional(v.string()),
    audioAssetUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { sceneId, imageAssetUrl, audioAssetUrl } = args;

    const updates: any = {};
    if (imageAssetUrl !== undefined) updates.imageAssetUrl = imageAssetUrl;
    if (audioAssetUrl !== undefined) updates.audioAssetUrl = audioAssetUrl;

    await ctx.db.patch(sceneId, updates);
    return true;
  }
});

export const updateVideoStatus = mutation({
  args: {
    videoId: v.id("videos"),
    status: v.union(
      v.literal("idea"),
      v.literal("scripting"),
      v.literal("generating_assets"),
      v.literal("rendering"),
      v.literal("ready"),
      v.literal("scheduled"),
      v.literal("publishing"),
      v.literal("published"),
      v.literal("error")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, { status: args.status });
    return true;
  }
});

export const getDashboardData = query({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.email) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email!))
      .first();

    if (!user) return null;

    const channel = await ctx.db
      .query("channels")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    const videoMetrics = { total: 0, drafts: 0, scheduled: 0, avgViews: 0 };
    
    if (!channel) {
      return { videos: [], metrics: videoMetrics };
    }

    const videos = await ctx.db
      .query("videos")
      .withIndex("by_channel", (q) => q.eq("channelId", channel._id))
      .order("desc")
      .collect();

    videoMetrics.total = videos.length;
    videoMetrics.drafts = videos.filter(v => ['idea', 'scripting', 'generating_assets', 'rendering'].includes(v.status)).length;
    videoMetrics.scheduled = videos.filter(v => v.status === 'ready').length;
    
    return {
      videos,
      metrics: videoMetrics
    };
  }
});

export const scheduleVideoForPublishing = mutation({
  args: {
    videoId: v.id("videos"),
    publishAt: v.number(), // unix timestamp
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      status: "scheduled",
      publishedAt: args.publishAt,
    });
    return true;
  },
});

export const markVideoAsPublished = mutation({
  args: {
    videoId: v.id("videos"),
    youtubeVideoId: v.string(),
    publishedUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      status: "published",
      youtubeVideoId: args.youtubeVideoId,
      publishedUrl: args.publishedUrl,
      publishedAtActual: Date.now(),
    });
    return true;
  },
});

export const updateVideoMetrics = mutation({
  args: {
    videoId: v.id("videos"),
    views: v.optional(v.number()),
    likes: v.optional(v.number()),
    comments: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { videoId, ...metrics } = args;
    const cleanMetrics = Object.fromEntries(
      Object.entries(metrics).filter(([_, v]) => v !== undefined)
    );
    
    await ctx.db.patch(videoId, {
      ...cleanMetrics,
      lastSyncedAt: Date.now(),
    } as any);
    return true;
  },
});

export const updateVideoMetadata = mutation({
  args: {
    videoId: v.id("videos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { videoId, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    await ctx.db.patch(videoId, cleanUpdates as any);
    return true;
  },
});

export const getScheduledVideosReadyToPublish = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "scheduled"),
          q.lte(q.field("publishedAt"), now)
        )
      )
      .collect();

    return videos;
  },
});