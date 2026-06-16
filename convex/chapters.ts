import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listChapters = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const getChapter = query({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.chapterId);
  },
});

export const createChapter = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
    const order = chapters.length;

    return await ctx.db.insert("chapters", {
      ...args,
      order,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateChapter = mutation({
  args: {
    chapterId: v.id("chapters"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { chapterId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(chapterId, {
      ...updates,
      updatedAt: now,
    });
  },
});

export const deleteChapter = mutation({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    // Cascade delete lessons
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .collect();
      
    for (const lesson of lessons) {
      await ctx.db.delete(lesson._id);
    }
    
    await ctx.db.delete(args.chapterId);
  },
});

export const reorderChapters = mutation({
  args: {
    updates: v.array(
      v.object({
        _id: v.id("chapters"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const update of args.updates) {
      await ctx.db.patch(update._id, {
        order: update.order,
        updatedAt: now,
      });
    }
  },
});
