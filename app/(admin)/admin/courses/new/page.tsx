"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function NewCoursePage() {
  const router = useRouter();
  const createCourse = useMutation(api.courses.createCourse);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const generateFileUrl = useMutation(api.files.generateFileUrl);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let thumbnailUrl = undefined;
      
      if (thumbnailFile) {
        // Upload file to Convex storage
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": thumbnailFile.type },
          body: thumbnailFile,
        });
        const { storageId } = await result.json();
        thumbnailUrl = await generateFileUrl({ storageId }) ?? undefined;
      }
      
      await createCourse({
        title,
        description,
        thumbnailUrl,
        isPublished,
      });
      
      toast.success("Course created successfully");
      router.push("/admin/courses");
    } catch (error) {
      toast.error("Failed to create course");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/admin/courses"><ArrowLeft size={20} /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-outfit font-bold text-text-primary">Create New Course</h1>
          <p className="text-text-secondary mt-1">Set up the foundation for a new training module</p>
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
                placeholder="e.g., Introduction to Tyres 101"
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
                placeholder="Briefly describe what this course covers..."
                required
                rows={4}
                className="w-full rounded-md border border-input bg-surface-secondary dark:bg-surface-secondary text-text-primary dark:text-text-primary px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="thumbnail" className="text-base font-semibold">Thumbnail Image (Optional)</Label>
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
                    <p className="text-sm text-text-secondary mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                  {thumbnailFile && (
                    <p className="text-sm text-apollo font-medium mt-2">
                      Selected: {thumbnailFile.name}
                    </p>
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
              <Button type="button" variant="outline" asChild className="h-12 px-8">
                <Link href="/admin/courses">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-12 px-8 bg-apollo hover:bg-apollo-dark text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
