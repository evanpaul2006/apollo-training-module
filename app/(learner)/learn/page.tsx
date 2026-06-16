"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearnerCatalogPage() {
  const courses = useQuery(api.courses.listPublishedCourses);

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-outfit font-bold text-text-primary">
          Welcome back.
        </h1>
        <p className="text-xl text-text-secondary">
          Ready to learn? Pick up where you left off or discover new training modules.
        </p>
      </div>

      {!courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80 rounded-3xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-surface-secondary border border-border rounded-3xl p-16 text-center">
          <div className="w-20 h-20 bg-white shadow-sm text-apollo rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={40} />
          </div>
          <h3 className="text-2xl font-outfit font-bold text-text-primary mb-3">No courses available</h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto text-lg">
            There are currently no published training modules. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course._id} className="overflow-hidden rounded-3xl border-border shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
              <div className="aspect-[16/10] bg-gradient-to-br from-apollo to-apollo-light flex items-center justify-center relative overflow-hidden">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-white text-6xl font-bold font-outfit group-hover:scale-110 transition-transform duration-500">
                    {course.title.charAt(0).toUpperCase()}
                  </span>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-6 pb-4 flex-1">
                <h3 className="font-outfit font-bold text-xl text-text-primary mb-3 line-clamp-2 leading-tight group-hover:text-apollo transition-colors">
                  {course.title}
                </h3>
                <p className="text-text-secondary line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0 mt-auto">
                <Button asChild className="w-full bg-apollo hover:bg-apollo-dark text-white rounded-xl h-12 text-base font-semibold group/btn">
                  <Link href={`/learn/courses/${course._id}`}>
                    Start Course
                    <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
