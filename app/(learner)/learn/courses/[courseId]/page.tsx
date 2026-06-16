"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, FileVideo, FileText, FileBarChart, Type } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LESSON_ICONS = {
  video: <FileVideo size={16} className="text-red-600" />,
  pdf: <FileText size={16} className="text-orange-600" />,
  ppt: <FileBarChart size={16} className="text-blue-600" />,
  text: <Type size={16} className="text-green-600" />,
};

const LESSON_BADGES = {
  video: "bg-red-50 text-red-700 border-red-200",
  pdf: "bg-orange-50 text-orange-700 border-orange-200",
  ppt: "bg-blue-50 text-blue-700 border-blue-200",
  text: "bg-green-50 text-green-700 border-green-200",
};

export default function LearnerCourseOverviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const course = useQuery(api.courses.getCourse, { courseId: courseId as any });
  const chapters = useQuery(api.chapters.listChapters, { courseId: courseId as any });
  
  if (!course || !chapters) {
    return <div className="p-8 max-w-4xl mx-auto"><Skeleton className="h-[500px] rounded-3xl" /></div>;
  }

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <div className="relative bg-apollo-dark text-white pt-12 pb-24 px-8">
        <div className="max-w-4xl mx-auto relative z-10">
          <Button variant="ghost" size="sm" asChild className="mb-6 text-white/80 hover:text-white hover:bg-white/10 -ml-3">
            <Link href="/learn"><ArrowLeft size={16} className="mr-2" /> Back to Catalog</Link>
          </Button>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-outfit font-bold leading-tight">
                {course.title}
              </h1>
              <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
                {course.description}
              </p>
            </div>
            
            <div className="hidden md:block">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full aspect-video object-cover rounded-2xl shadow-xl border-4 border-white/10" />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-apollo to-apollo-light rounded-2xl shadow-xl border-4 border-white/10 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold font-outfit">
                    {course.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-apollo/50 to-transparent pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-lg border border-border p-8 md:p-12">
          <h2 className="text-2xl font-outfit font-bold text-text-primary mb-8">Course Curriculum</h2>
          
          {sortedChapters.length === 0 ? (
            <div className="text-center py-12 text-text-secondary bg-surface-secondary rounded-2xl">
              No content available for this course yet.
            </div>
          ) : (
            <Accordion className="space-y-4">
              {sortedChapters.map((chapter, index) => (
                <ChapterAccordionItem 
                  key={chapter._id} 
                  chapter={chapter} 
                  index={index} 
                  courseId={courseId}
                />
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterAccordionItem({ chapter, index, courseId }: any) {
  const lessons = useQuery(api.lessons.listLessons, { chapterId: chapter._id });

  return (
    <AccordionItem value={chapter._id} className="border border-border rounded-2xl overflow-hidden bg-white px-2">
      <AccordionTrigger className="hover:no-underline px-4 py-5 group">
        <div className="flex flex-col items-start text-left gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-apollo">Chapter {index + 1}</span>
          <span className="text-lg font-semibold text-text-primary group-hover:text-apollo transition-colors">{chapter.title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-6 pt-2">
        {!lessons ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-sm text-text-secondary py-2 italic">No lessons in this chapter.</p>
        ) : (
          <div className="space-y-3">
            {lessons.sort((a, b) => a.order - b.order).map((lesson, lessonIdx) => (
              <Link 
                key={lesson._id}
                href={`/learn/courses/${courseId}/chapters/${chapter._id}/lessons/${lesson._id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-secondary hover:bg-apollo-muted hover:border-apollo-light transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${LESSON_BADGES[lesson.type as keyof typeof LESSON_BADGES]}`}>
                  {LESSON_ICONS[lesson.type as keyof typeof LESSON_ICONS]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary group-hover:text-apollo transition-colors">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">{lesson.type}</span>
                  </div>
                </div>
                <div className="text-apollo opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <PlayCircle size={24} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
