import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    thumbnailUrl: v.optional(v.string()),   // Convex storage URL or external URL
    isPublished: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  chapters: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_course", ["courseId"]),

  lessons: defineTable({
    chapterId: v.id("chapters"),
    courseId: v.id("courses"),            // denormalized for efficient queries
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("video"),
      v.literal("pdf"),
      v.literal("ppt"),
      v.literal("text")
    ),
    content: v.optional(v.string()),      // For "text" type: rich text / markdown content
    fileUrl: v.optional(v.string()),      // Convex storage URL for PDF/video uploads
    externalUrl: v.optional(v.string()),  // For YouTube/Vimeo links or PPT embed URLs
    order: v.number(),
    duration: v.optional(v.number()),     // Duration in seconds (for video)
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_chapter", ["chapterId"])
    .index("by_course", ["courseId"]),
});
