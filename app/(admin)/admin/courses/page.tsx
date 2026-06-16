"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Layers, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminCoursesPage() {
  const courses = useQuery(api.courses.listCourses);
  const deleteCourse = useMutation(api.courses.deleteCourse);
  const togglePublish = useMutation(api.courses.togglePublish);
  
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCourse({ courseId: courseToDelete as any });
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error("Failed to delete course");
    } finally {
      setIsDeleting(false);
      setCourseToDelete(null);
    }
  };

  const handleTogglePublish = async (courseId: any, currentStatus: boolean) => {
    try {
      await togglePublish({ courseId, isPublished: !currentStatus });
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (err) {
      toast.error("Failed to update course status");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-text-primary">Courses</h1>
          <p className="text-text-secondary mt-1">Manage training modules</p>
        </div>
        <Button asChild className="bg-apollo hover:bg-apollo-dark text-white shadow-sm">
          <Link href="/admin/courses/new">Create New Course</Link>
        </Button>
      </div>

      {!courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <h3 className="text-lg font-outfit font-bold text-text-primary mb-2">No courses found</h3>
          <p className="text-text-secondary mb-6">Create a new course to start adding chapters and lessons.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id} className="overflow-hidden rounded-2xl hover:shadow-md transition-shadow group">
              <div className="aspect-video bg-gradient-to-br from-apollo to-apollo-light flex items-center justify-center relative">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-5xl font-bold font-outfit">
                    {course.title.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 backdrop-blur-sm ${
                    course.isPublished ? "bg-green-500/90 text-white" : "bg-white/90 text-text-secondary"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${course.isPublished ? "bg-white animate-pulse" : "bg-gray-400"}`}></span>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <CardContent className="p-5 pb-2">
                <h3 className="font-outfit font-bold text-lg text-text-primary mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 min-h-[40px]">{course.description}</p>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-border mt-4 pt-4">
                <div className="flex gap-4 text-sm text-text-secondary font-medium">
                  <Link href={`/admin/courses/${course._id}`} className="text-apollo hover:underline flex items-center gap-1">
                    <Layers size={16} /> Edit Content
                  </Link>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted text-text-secondary hover:text-text-primary">
                    <MoreVertical size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => window.open(`/learn/courses/${course._id}`, '_blank')}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View as Learner
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = `/admin/courses/${course._id}/edit`}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleTogglePublish(course._id, course.isPublished)}
                      className="cursor-pointer"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setCourseToDelete(course._id)}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Course
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the course, along with all of its chapters and lessons.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCourseToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Dummy component just for the icon since I didn't import it at the top
function CheckCircle2(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
}
