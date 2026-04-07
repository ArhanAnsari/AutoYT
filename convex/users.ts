import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Syncs a NextAuth user into Convex database.
 * If the user doesn't exist, it creates one.
 */
export const syncUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    // Default 5 credits for a free tier user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      planTier: "free",
      credits: 5, 
    });

    return userId;
  },
});

export const syncChannel = mutation({
  args: {
    userId: v.id("users"),
    youtubeAuthToken: v.optional(v.string()),
    youtubeRefreshToken: v.optional(v.string()),
    channelTitle: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if channel already exists for this user
    const existingChannel = await ctx.db
      .query("channels")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingChannel) {
      await ctx.db.patch(existingChannel._id, {
        youtubeAuthToken: args.youtubeAuthToken,
        youtubeRefreshToken: args.youtubeRefreshToken,
        channelName: args.channelTitle,
      });
      return existingChannel._id;
    }

    return await ctx.db.insert("channels", {
      userId: args.userId,
      youtubeAuthToken: args.youtubeAuthToken,
      youtubeRefreshToken: args.youtubeRefreshToken,
      channelName: args.channelTitle,
    });
  }
});

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getUserChannel = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("channels")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  }
});