"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, MonitorPlay, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const courses = useQuery(api.courses.listCourses);
  const chapters = useQuery(api.chapters.listChapters, courses && courses.length > 0 ? { courseId: courses[0]._id } : "skip");
  // Note: for a real dashboard, we might want aggregate queries, but for now we'll approximate 
  // or fetch all to count. Since we only have list per course, let's just show course stats.

  const publishedCount = courses?.filter((c) => c.isPublished).length || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Overview of your learning platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="border-apollo text-apollo hover:bg-apollo-muted">
            <Link href="/learn" target="_blank">View Learner Portal</Link>
          </Button>
          <Button asChild className="bg-apollo hover:bg-apollo-dark text-white shadow-sm">
            <Link href="/admin/courses/new">Create New Course</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={courses ? courses.length : undefined}
          icon={BookOpen}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Published Courses"
          value={courses ? publishedCount : undefined}
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Draft Courses"
          value={courses ? courses.length - publishedCount : undefined}
          icon={Layers}
          color="bg-orange-50 text-orange-600"
        />
        <StatCard
          title="Avg. Completion"
          value={courses ? "0%" : undefined} // Placeholder for LMS tracking
          icon={MonitorPlay}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-outfit font-bold text-text-primary mb-6">Recent Courses</h2>
        {!courses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-apollo-muted text-apollo rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-outfit font-bold text-text-primary mb-2">No courses yet</h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Get started by creating your first training module for Apollo Tyres employees.
            </p>
            <Button asChild className="bg-apollo hover:bg-apollo-dark text-white">
              <Link href="/admin/courses/new">Create First Course</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <Card key={course._id} className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-apollo to-apollo-light flex items-center justify-center relative">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-5xl font-bold font-outfit">
                      {course.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 backdrop-blur-sm ${
                      course.isPublished ? "bg-green-500/90 text-white" : "bg-white/90 text-text-secondary"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${course.isPublished ? "bg-white animate-pulse" : "bg-gray-400"}`}></span>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-outfit font-bold text-lg text-text-primary mb-2 line-clamp-1">{course.title}</h3>
                  <div className="flex gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Layers size={16} />
                      <span>{course.order}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          {value === undefined ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-outfit font-bold text-text-primary">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
