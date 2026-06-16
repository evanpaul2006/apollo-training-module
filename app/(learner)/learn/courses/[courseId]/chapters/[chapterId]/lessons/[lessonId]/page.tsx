"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";

// Safe markdown rendering (since @uiw/react-markdown-preview has its own sanitizer, but we can also use dompurify directly)
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), { ssr: false });

export default function LessonViewerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;
  const lessonId = params.lessonId as string;
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = useQuery(api.courses.getCourse, { courseId: courseId as any });
  const chapter = useQuery(api.chapters.getChapter, { chapterId: chapterId as any });
  const lesson = useQuery(api.lessons.getLesson, { lessonId: lessonId as any });
  const allChapters = useQuery(api.chapters.listChapters, { courseId: courseId as any });
  const adjacentLessons = useQuery(api.lessons.getAdjacentLessons, { lessonId: lessonId as any, courseId: courseId as any });

  if (!course || !chapter || !lesson || !allChapters) {
    return <div className="p-8 max-w-7xl mx-auto"><Skeleton className="h-[600px] rounded-3xl" /></div>;
  }

  const sortedChapters = [...allChapters].sort((a, b) => a.order - b.order);

  const NavigationSidebar = () => (
    <div className="h-full flex flex-col bg-surface-secondary border-r border-border">
      <div className="p-4 border-b border-border bg-white sticky top-0 z-10 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0 text-text-secondary hover:text-apollo hover:bg-apollo-muted">
          <Link href={`/learn/courses/${courseId}`}><ArrowLeft size={20} /></Link>
        </Button>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-apollo truncate">Back to Course</p>
          <h2 className="text-sm font-bold text-text-primary truncate">{course.title}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sortedChapters.map((ch, idx) => (
          <ChapterNavSection key={ch._id} chapter={ch} index={idx} currentLessonId={lessonId} courseId={courseId} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-60px)] overflow-hidden bg-surface">
      {/* Mobile Sidebar Toggle & Breadcrumb */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-white">
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">
            Chapter {sortedChapters.findIndex(c => c._id === chapterId) + 1}
          </span>
          <span className="font-semibold text-text-primary truncate max-w-[200px]">{lesson.title}</span>
        </div>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 shrink-0 text-apollo border border-apollo hover:bg-apollo-muted">
            <Menu size={16} className="mr-2" />
            Menu
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SheetTitle className="sr-only">Course Navigation</SheetTitle>
            <NavigationSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[320px] shrink-0 h-full overflow-hidden">
        <NavigationSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
              <span className="uppercase tracking-wider">Chapter {sortedChapters.findIndex(c => c._id === chapterId) + 1}</span>
              <span>&bull;</span>
              <span className="uppercase tracking-wider">{lesson.type}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-outfit font-bold text-text-primary">
              {lesson.title}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-8 min-h-[400px]">
            {lesson.type === "video" && <VideoPlayer url={lesson.fileUrl || lesson.externalUrl} />}
            {lesson.type === "pdf" && <PdfViewer url={lesson.fileUrl || lesson.externalUrl} />}
            {lesson.type === "ppt" && <PptViewer url={lesson.fileUrl || lesson.externalUrl} />}
            {lesson.type === "text" && <TextContent content={lesson.content} />}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-auto mb-8">
            {adjacentLessons?.prev ? (
              <Button variant="outline" asChild className="h-12 px-6 border-border text-text-primary hover:bg-surface-secondary">
                <Link href={`/learn/courses/${courseId}/chapters/${adjacentLessons.prev.chapterId}/lessons/${adjacentLessons.prev._id}`}>
                  <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {adjacentLessons?.next ? (
              <Button asChild className="h-12 px-6 bg-apollo hover:bg-apollo-dark text-white">
                <Link href={`/learn/courses/${courseId}/chapters/${adjacentLessons.next.chapterId}/lessons/${adjacentLessons.next._id}`}>
                  Next Lesson <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white">
                <Link href={`/learn/courses/${courseId}`}>
                  Complete Course <CheckCircle2 className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChapterNavSection({ chapter, index, currentLessonId, courseId }: any) {
  const lessons = useQuery(api.lessons.listLessons, { chapterId: chapter._id });

  if (!lessons) return <Skeleton className="h-20 w-full rounded-xl" />;

  const isCurrentChapter = lessons.some(l => l._id === currentLessonId);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary pl-2">
        Chapter {index + 1}: {chapter.title}
      </h3>
      <div className="space-y-1">
        {lessons.sort((a, b) => a.order - b.order).map((lesson, idx) => {
          const isActive = lesson._id === currentLessonId;
          return (
            <Link
              key={lesson._id}
              href={`/learn/courses/${courseId}/chapters/${chapter._id}/lessons/${lesson._id}`}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-apollo-muted border-l-4 border-apollo pl-2 shadow-sm" 
                  : "hover:bg-white text-text-secondary hover:text-text-primary"
              }`}
            >
              <div className={`mt-0.5 shrink-0 ${isActive ? "text-apollo" : "text-text-muted"}`}>
                {isActive ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </div>
              <div>
                <p className={`text-sm leading-tight ${isActive ? "font-bold text-apollo-dark" : "font-medium"}`}>
                  {lesson.title}
                </p>
                <p className="text-[10px] uppercase tracking-wider font-semibold mt-1 opacity-70">
                  {lesson.type}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function VideoPlayer({ url }: { url?: string }) {
  if (!url) return <div className="p-12 text-center text-text-secondary bg-surface-secondary">No video source provided.</div>;
  
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = url.includes("vimeo.com");

  if (isYoutube) {
    const videoId = url.split("v=")[1] || url.split("youtu.be/")[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId?.split("&")[0]}`;
    return (
      <div className="aspect-video w-full">
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      </div>
    );
  }

  if (isVimeo) {
    const videoId = url.split("vimeo.com/")[1];
    const embedUrl = `https://player.vimeo.com/video/${videoId}`;
    return (
      <div className="aspect-video w-full">
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen; picture-in-picture" />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-black">
      <video src={url} controls className="w-full h-full object-contain" controlsList="nodownload" />
    </div>
  );
}

function PdfViewer({ url }: { url?: string }) {
  if (!url) return <div className="p-12 text-center text-text-secondary bg-surface-secondary">No PDF source provided.</div>;
  
  // To avoid dealing with react-pdf rendering complexities in a simple way, we can use an iframe first, 
  // or use react-pdf if preferred. We'll use a responsive iframe for maximum compatibility.
  return (
    <div className="w-full h-[600px] md:h-[800px]">
      <iframe src={`${url}#toolbar=0`} className="w-full h-full border-0" />
    </div>
  );
}

function PptViewer({ url }: { url?: string }) {
  if (!url) return <div className="p-12 text-center text-text-secondary bg-surface-secondary">No presentation URL provided.</div>;
  
  if (url.includes("docs.google.com/presentation")) {
    const embedUrl = url.replace(/\/edit.*$/, "/embed?start=false&loop=false&delayms=3000");
    return (
      <div className="w-full aspect-video min-h-[500px]">
        <iframe src={embedUrl} className="w-full h-full border-0" />
      </div>
    );
  }

  const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  
  return (
    <div className="w-full aspect-video min-h-[500px]">
      <iframe src={embedUrl} className="w-full h-full border-0" />
    </div>
  );
}

function TextContent({ content }: { content?: string }) {
  if (!content) return <div className="p-12 text-center text-text-secondary bg-surface-secondary">No content provided.</div>;
  
  return (
    <div className="p-8 md:p-12 prose prose-lg prose-apollo max-w-none">
      <div data-color-mode="light">
        <MarkdownPreview source={content} wrapperElement={{ "data-color-mode": "light" }} />
      </div>
    </div>
  );
}
