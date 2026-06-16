import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listLessons = query({
  args: { chapterId: v.id("chapters") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .collect();
  },
});

export const getLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});

export const getAdjacentLessons = query({
  args: { lessonId: v.id("lessons"), courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const allChapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
    
    // Sort chapters by order
    allChapters.sort((a, b) => a.order - b.order);

    let allLessons: any[] = [];
    for (const chapter of allChapters) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_chapter", (q) => q.eq("chapterId", chapter._id))
        .collect();
      // Sort lessons by order
      lessons.sort((a, b) => a.order - b.order);
      allLessons = [...allLessons, ...lessons];
    }

    const currentIndex = allLessons.findIndex((l) => l._id === args.lessonId);
    if (currentIndex === -1) return { prev: null, next: null };

    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    };
  },
});

export const createLesson = mutation({
  args: {
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("video"),
      v.literal("pdf"),
      v.literal("ppt"),
      v.literal("text")
    ),
    content: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    externalUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_chapter", (q) => q.eq("chapterId", args.chapterId))
      .collect();
    const order = lessons.length;

    return await ctx.db.insert("lessons", {
      ...args,
      order,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("video"),
        v.literal("pdf"),
        v.literal("ppt"),
        v.literal("text")
      )
    ),
    content: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    externalUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { lessonId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(lessonId, {
      ...updates,
      updatedAt: now,
    });
  },
});

export const deleteLesson = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (lesson?.storageId) {
      await ctx.storage.delete(lesson.storageId);
    }
    await ctx.db.delete(args.lessonId);
  },
});

export const reorderLessons = mutation({
  args: {
    updates: v.array(
      v.object({
        _id: v.id("lessons"),
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
