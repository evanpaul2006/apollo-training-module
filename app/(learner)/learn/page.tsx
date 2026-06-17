"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearnerCatalogPage() {
  const courses = useQuery(api.courses.listPublishedCourses);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="space-y-2 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-outfit font-semibold text-neutral-900 tracking-tight">
          Welcome back.
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed">
          Ready to learn? Pick up where you left off or discover new training modules.
        </p>
      </div>

      {!courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-2xl flex flex-col p-5 h-[380px]">
              <Skeleton className="w-full h-40 rounded-xl mb-6 bg-neutral-200/60" />
              <Skeleton className="w-3/4 h-6 rounded-lg mb-3 bg-neutral-200/60" />
              <Skeleton className="w-full h-4 rounded-lg mb-2 bg-neutral-200/60" />
              <Skeleton className="w-2/3 h-4 rounded-lg mb-6 bg-neutral-200/60" />
              <Skeleton className="w-full h-11 rounded-lg mt-auto bg-neutral-200/60" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="border border-neutral-200 bg-white rounded-2xl text-center max-w-xl mx-auto mt-12 p-12 flex flex-col items-center">
          <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mb-6 border border-neutral-100">
            <BookOpen size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">No courses available</h3>
          <p className="text-neutral-500 max-w-sm mx-auto text-sm">
            There are currently no published training modules. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white border border-neutral-200 rounded-2xl group flex flex-col overflow-hidden transition-all duration-200 ease-out hover:shadow-md hover:border-neutral-300">
              <div className="aspect-[16/10] bg-neutral-100 flex items-center justify-center relative overflow-hidden border-b border-neutral-100">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                  <span className="text-neutral-300 text-5xl font-bold font-outfit">
                    {course.title.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="mb-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
                    Module
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2 leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3 mb-6">
                  {course.description}
                </p>
                
                <div className="mt-auto w-full">
                  <Link href={`/learn/courses/${course._id}`} className="flex w-full items-center justify-center gap-2 bg-apollo text-white rounded-xl py-2.5 px-4 font-medium text-sm active:scale-[0.98] transition-all duration-200 ease-out hover:bg-apollo-dark">
                    Start Course
                    <ChevronRight size={16} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
