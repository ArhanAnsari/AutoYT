import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAutomation = mutation({
  args: {
    channelId: v.id("channels"),
    name: v.string(),
    triggerConfig: v.object({
      type: v.string(),
      value: v.string(),
    }),
    actionConfig: v.object({
      type: v.string(),
      parameters: v.any(),
    }),
  },
  handler: async (ctx, args) => {
    const automationId = await ctx.db.insert("automations", {
      channelId: args.channelId,
      name: args.name,
      triggerConfig: args.triggerConfig,
      actionConfig: args.actionConfig,
      isActive: true,
      createdAt: Date.now(),
    });

    return automationId;
  },
});

export const updateAutomation = mutation({
  args: {
    automationId: v.id("automations"),
    name: v.optional(v.string()),
    triggerConfig: v.optional(
      v.object({
        type: v.string(),
        value: v.string(),
      })
    ),
    actionConfig: v.optional(
      v.object({
        type: v.string(),
        parameters: v.any(),
      })
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { automationId, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    
    await ctx.db.patch(automationId, cleanUpdates as any);
    return true;
  },
});

export const deleteAutomation = mutation({
  args: { automationId: v.id("automations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.automationId);
    return true;
  },
});

export const toggleAutomation = mutation({
  args: { automationId: v.id("automations") },
  handler: async (ctx, args) => {
    const automation = await ctx.db.get(args.automationId);
    if (!automation) throw new Error("Automation not found");

    await ctx.db.patch(args.automationId, {
      isActive: !automation.isActive,
    });
    return !automation.isActive;
  },
});

export const getAutomationsByChannel = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("automations")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .order("desc")
      .collect();
  },
});

export const recordAutomationRun = mutation({
  args: {
    automationId: v.id("automations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.automationId, {
      lastRunAt: Date.now(),
      lastRunStatus: args.status,
    });
    return true;
  },
});
