import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    stripeCustomerId: v.optional(v.string()),
    planTier: v.string(), // e.g., "free", "creator", "pro", "agency"
    credits: v.number(),
  }).index("by_email", ["email"]),

  channels: defineTable({
    userId: v.id("users"),
    youtubeAuthToken: v.optional(v.string()),
    youtubeRefreshToken: v.optional(v.string()), // usually need refresh token
    channelName: v.string(),
    defaultBrandStyle: v.optional(v.object({
      voiceId: v.optional(v.string()),
      visualStyle: v.optional(v.string()),
    })),
  }).index("by_user", ["userId"]),

  videos: defineTable({
    channelId: v.id("channels"),
    title: v.string(),
    description: v.optional(v.string()),
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
    publishedUrl: v.optional(v.string()),
    youtubeVideoId: v.optional(v.string()),
    publishedAt: v.optional(v.number()), // timestamp when video should be published
    publishedAtActual: v.optional(v.number()), // actual publish timestamp
    errorMessage: v.optional(v.string()),
    views: v.optional(v.number()),
    likes: v.optional(v.number()),
    comments: v.optional(v.number()),
    lastSyncedAt: v.optional(v.number()),
  }).index("by_channel", ["channelId"]),

  scenes: defineTable({
    videoId: v.id("videos"),
    order: v.number(),
    narrationText: v.string(),
    imagePrompt: v.string(),
    imageAssetUrl: v.optional(v.string()),
    audioAssetUrl: v.optional(v.string()),
    durationMs: v.optional(v.number()),
  }).index("by_video", ["videoId"]),

  automations: defineTable({
    channelId: v.id("channels"),
    name: v.string(),
    triggerConfig: v.object({
      type: v.string(), // e.g. "schedule", "rss", "webhook"
      value: v.string(), // e.g. "0 9 * * 1" for Mondays or RSS feed URL
    }),
    actionConfig: v.object({
      type: v.string(), // e.g. "generate_video"
      parameters: v.any(),
    }),
    isActive: v.boolean(),
    createdAt: v.number(),
    lastRunAt: v.optional(v.number()),
    lastRunStatus: v.optional(v.string()), // "success" or "failed"
  }).index("by_channel", ["channelId"]),
});