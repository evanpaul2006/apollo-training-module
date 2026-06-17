"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const course = useQuery(api.courses.getCourse, { courseId: courseId as any });
  const updateCourse = useMutation(api.courses.updateCourse);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const generateFileUrl = useMutation(api.files.generateFileUrl);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setIsPublished(course.isPublished);
    }
  }, [course]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let thumbnailUrl = course?.thumbnailUrl;
      
      if (thumbnailFile) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": thumbnailFile.type },
          body: thumbnailFile,
        });
        const { storageId } = await result.json();
        thumbnailUrl = await generateFileUrl({ storageId }) ?? undefined;
      }
      
      await updateCourse({
        courseId: courseId as any,
        title,
        description,
        thumbnailUrl,
        isPublished,
      });
      
      toast.success("Course updated successfully");
      router.push(`/admin/courses/${courseId}`);
    } catch (error) {
      toast.error("Failed to update course");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) {
    return <div className="p-8 max-w-4xl mx-auto"><Skeleton className="h-96 bg-neutral-200/60" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href={`/admin/courses/${courseId}`}><ArrowLeft size={20} /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-outfit font-bold text-text-primary">Edit Course</h1>
          <p className="text-text-secondary mt-1">Update course metadata and settings</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border shadow-sm bg-white text-text-primary dark:text-text-primary">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold">Course Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 bg-surface-secondary dark:bg-surface-secondary text-text-primary dark:text-text-primary"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full rounded-md border border-input bg-surface-secondary dark:bg-surface-secondary text-text-primary dark:text-text-primary px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="thumbnail" className="text-base font-semibold">Thumbnail Image</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-surface-secondary relative hover:bg-surface transition-colors">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-apollo-muted text-apollo rounded-full flex items-center justify-center">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Click to upload or drag and drop</p>
                    <p className="text-sm text-text-secondary mt-1">Leave empty to keep existing image</p>
                  </div>
                  {thumbnailFile && (
                    <p className="text-sm text-apollo font-medium mt-2">
                      Selected: {thumbnailFile.name}
                    </p>
                  )}
                  {course.thumbnailUrl && !thumbnailFile && (
                    <div className="mt-4">
                      <img src={course.thumbnailUrl} alt="Current" className="w-32 h-auto rounded-lg mx-auto" />
                      <p className="text-xs text-text-secondary mt-2">Current thumbnail</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-xl border border-border">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Publish Course</Label>
                <p className="text-sm text-text-secondary">Make this course visible to learners immediately</p>
              </div>
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-4">
              <Button type="button" variant="outline" asChild className="h-12 px-8 hover:bg-surface-secondary hover:text-text-primary dark:hover:bg-surface-secondary dark:hover:text-text-primary dark:border-border dark:text-text-primary">
                <Link href={`/admin/courses/${courseId}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-12 px-8 bg-apollo hover:bg-apollo-dark text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Course"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
