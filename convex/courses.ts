import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").order("asc").collect();
  },
});

export const listPublishedCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("asc")
      .collect();
  },
});

export const getCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId);
  },
});

export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    thumbnailUrl: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const courses = await ctx.db.query("courses").collect();
    const order = courses.length; // Simple ordering
    
    return await ctx.db.insert("courses", {
      ...args,
      order,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateCourse = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { courseId, ...updates } = args;
    const now = Date.now();
    
    await ctx.db.patch(courseId, {
      ...updates,
      updatedAt: now,
    });
  },
});

export const togglePublish = mutation({
  args: {
    courseId: v.id("courses"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.courseId, {
      isPublished: args.isPublished,
      updatedAt: now,
    });
  },
});

export const deleteCourse = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    // Cascade delete lessons and chapters
    const chapters = await ctx.db
      .query("chapters")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    for (const chapter of chapters) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_chapter", (q) => q.eq("chapterId", chapter._id))
        .collect();
        
      for (const lesson of lessons) {
        if (lesson.storageId) {
          await ctx.storage.delete(lesson.storageId);
        }
        await ctx.db.delete(lesson._id);
      }
      await ctx.db.delete(chapter._id);
    }
    
    await ctx.db.delete(args.courseId);
  },
});

export const reorderCourses = mutation({
  args: {
    updates: v.array(
      v.object({
        _id: v.id("courses"),
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
