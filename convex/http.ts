import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  pathPrefix: "/api/storage/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const storageId = url.pathname.replace("/api/storage/", "");
    
    if (!storageId) {
      return new Response("Missing storage ID", { status: 400 });
    }

    try {
      const blob = await ctx.storage.get(storageId as any);
      if (!blob) {
        return new Response("File not found", { status: 404 });
      }

      return new Response(blob);
    } catch (error) {
      return new Response("Invalid storage ID", { status: 400 });
    }
  }),
});

export default http;
