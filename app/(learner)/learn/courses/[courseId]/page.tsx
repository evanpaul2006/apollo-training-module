"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
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
  video: <FileVideo size={18} strokeWidth={2} className="text-red-600" />,
  pdf: <FileText size={18} strokeWidth={2} className="text-orange-600" />,
  ppt: <FileBarChart size={18} strokeWidth={2} className="text-blue-600" />,
  text: <Type size={18} strokeWidth={2} className="text-green-600" />,
};

const LESSON_BADGES = {
  video: "bg-red-50 text-red-700 border-red-100",
  pdf: "bg-orange-50 text-orange-700 border-orange-100",
  ppt: "bg-blue-50 text-blue-700 border-blue-100",
  text: "bg-green-50 text-green-700 border-green-100",
};

export default function LearnerCourseOverviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const course = useQuery(api.courses.getCourse, { courseId: courseId as any });
  const chapters = useQuery(api.chapters.listChapters, { courseId: courseId as any });
  
  if (!course || !chapters) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6 mt-8">
        <Skeleton className="w-24 h-6 rounded-md mb-6 bg-neutral-200/60" />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <Skeleton className="w-full h-10 rounded-lg bg-neutral-200/60" />
            <Skeleton className="w-3/4 h-6 rounded-lg bg-neutral-200/60" />
          </div>
          <Skeleton className="w-full md:w-1/3 aspect-video rounded-xl bg-neutral-200/60" />
        </div>
        <div className="pt-6 space-y-3">
          <Skeleton className="w-48 h-8 rounded-lg mb-2 bg-neutral-200/60" />
          <Skeleton className="w-full h-16 rounded-xl bg-neutral-200/60" />
          <Skeleton className="w-full h-16 rounded-xl bg-neutral-200/60" />
        </div>
      </div>
    );
  }

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-neutral-50/30 pb-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-10 md:pt-12 md:pb-12">
        <Link 
          href="/learn" 
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors duration-200 ease-out mb-6 active:scale-[0.97]"
        >
          <ArrowLeft size={16} strokeWidth={2} className="mr-2" />
          Back to Catalog
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
          <div className="w-full md:w-2/3 flex flex-col space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 tracking-tight">
              {course.title}
            </h1>
            <p className="text-[17px] text-neutral-600 leading-relaxed max-w-xl">
              {course.description}
            </p>
          </div>
          
          <div className="w-full md:w-1/3 shrink-0">
            <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden border border-black/5 shadow-sm relative">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-neutral-300 text-5xl font-bold">
                    {course.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Course Curriculum</h2>
        
        {sortedChapters.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-neutral-500 shadow-sm">
            No content available for this course yet.
          </div>
        ) : (
          <Accordion multiple defaultValue={sortedChapters.map(c => c._id)} className="space-y-3">
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
  );
}

function ChapterAccordionItem({ chapter, index, courseId }: any) {
  const lessons = useQuery(api.lessons.listLessons, { chapterId: chapter._id });

  return (
    <AccordionItem 
      value={chapter._id} 
      className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm data-[state=open]:border-neutral-300 transition-colors duration-200 ease-out"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-neutral-50/50 transition-colors duration-200 ease-out group">
        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mb-0.5">
            Chapter {index + 1}
          </span>
          <span className="text-[16px] font-semibold text-neutral-900 group-hover:text-apollo transition-colors duration-200 ease-out">
            {chapter.title}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-0">
        {!lessons ? (
          <div className="space-y-2 mt-2">
            <Skeleton className="h-12 w-full rounded-md bg-neutral-200/60" />
            <Skeleton className="h-12 w-full rounded-md bg-neutral-200/60" />
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-neutral-500 text-sm py-2 font-medium">No lessons in this chapter.</p>
        ) : (
          <div className="space-y-2 mt-2">
            {lessons.sort((a, b) => a.order - b.order).map((lesson, lessonIdx) => (
              <Link 
                key={lesson._id}
                href={`/learn/courses/${courseId}/chapters/${chapter._id}/lessons/${lesson._id}`}
                className="group flex items-center gap-3 p-2.5 rounded-md border border-transparent hover:border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 active:scale-[0.98] transition-all duration-200 ease-out"
              >
                <div className={`w-8 h-8 rounded shrink-0 border flex items-center justify-center ${LESSON_BADGES[lesson.type as keyof typeof LESSON_BADGES]}`}>
                  {LESSON_ICONS[lesson.type as keyof typeof LESSON_ICONS]}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-neutral-900 group-hover:text-apollo transition-colors duration-200 ease-out">
                    {lesson.title}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                    {lesson.type}
                  </p>
                </div>
                <div className="text-neutral-400 group-hover:text-apollo group-hover:scale-110 transition-transform duration-200 ease-out mr-1">
                  <PlayCircle size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
