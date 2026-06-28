"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileVideo, FileText, FileBarChart, Type, Upload, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const LESSON_TYPES = [
  { id: "video", label: "Video", icon: FileVideo, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { id: "pdf", label: "PDF Document", icon: FileText, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { id: "ppt", label: "Presentation", icon: FileBarChart, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "text", label: "Rich Text", icon: Type, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
];

export function LessonForm({ courseId, chapterId, lessonToEdit, onClose }: any) {
  const createLesson = useMutation(api.lessons.createLesson);
  const updateLesson = useMutation(api.lessons.updateLesson);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const generateFileUrl = useMutation(api.files.generateFileUrl);

  const [title, setTitle] = useState(lessonToEdit?.title || "");
  const [description, setDescription] = useState(lessonToEdit?.description || "");
  const [type, setType] = useState(lessonToEdit?.type || "video");
  const [content, setContent] = useState(lessonToEdit?.content || "");
  const [externalUrl, setExternalUrl] = useState(lessonToEdit?.externalUrl || "");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lessonToEdit) {
      setTitle(lessonToEdit.title);
      setDescription(lessonToEdit.description || "");
      setType(lessonToEdit.type);
      setContent(lessonToEdit.content || "");
      setExternalUrl(lessonToEdit.externalUrl || "");
    }
  }, [lessonToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let fileUrl = lessonToEdit?.fileUrl;
      let storageIdToSave = lessonToEdit?.storageId;

      if (file) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        storageIdToSave = storageId;
        fileUrl = await generateFileUrl({ storageId }) ?? undefined;
      }

      const lessonData = {
        title,
        description,
        type,
        content: type === "text" ? content : undefined,
        externalUrl: type !== "text" && !file ? externalUrl : undefined,
        fileUrl: type !== "text" && file ? fileUrl : lessonToEdit?.fileUrl,
        storageId: type !== "text" && file ? storageIdToSave : lessonToEdit?.storageId,
      };

      if (lessonToEdit) {
        await updateLesson({ lessonId: lessonToEdit._id, ...lessonData });
        toast.success("Lesson updated successfully");
      } else {
        await createLesson({ courseId, chapterId, ...lessonData });
        toast.success("Lesson created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${lessonToEdit ? "update" : "create"} lesson`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-2xl border-border shadow-sm bg-white text-text-primary dark:text-text-primary">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-2xl font-outfit font-bold text-text-primary">
              {lessonToEdit ? "Edit Lesson" : "New Lesson"}
            </h2>
            <Button type="button" variant="ghost" onClick={onClose}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LESSON_TYPES.map((t) => (
              <div
                key={t.id}
                onClick={() => setType(t.id)}
                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                  type === t.id
                    ? `${t.border} ${t.bg} ring-2 ring-apollo ring-offset-2`
                    : "border-border hover:border-apollo-light"
                }`}
              >
                <t.icon size={32} className={t.color} />
                <span className="font-semibold text-sm">{t.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-surface-secondary dark:bg-surface-secondary text-text-primary dark:text-text-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-surface-secondary dark:bg-surface-secondary text-text-primary dark:text-text-primary"
              />
            </div>
          </div>

          {type === "text" && (
            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <div data-color-mode="light" className="border border-border rounded-md overflow-hidden">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  height={400}
                />
              </div>
            </div>
          )}

          {type === "video" && (
            <div className="space-y-6 bg-surface-secondary p-6 rounded-xl border border-border">
              <div className="space-y-2">
                <Label>External Video URL</Label>
                <p className="text-xs text-text-muted mb-2">
                  Paste a link to a YouTube, Vimeo, or Google Drive video. Direct video uploads are disabled to save data egress.
                </p>
                <Input
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/..."
                  className="bg-white border-2 border-border focus:border-apollo text-neutral-900 shadow-sm h-11"
                />
                {lessonToEdit?.fileUrl && !externalUrl && (
                  <p className="text-sm text-amber-600 font-medium mt-2">
                    Warning: This lesson still uses a Convex-hosted video. Please migrate it to YouTube/Vimeo/Drive to save data egress.
                  </p>
                )}
              </div>
            </div>
          )}

          {(type === "pdf" || type === "ppt") && (
            <div className="space-y-6 bg-surface-secondary p-6 rounded-xl border border-border">
              <div className="space-y-2">
                <Label>Google Drive URL</Label>
                <p className="text-xs text-text-muted mb-2">
                  Upload your {type.toUpperCase()} file to Google Drive, set permissions to "Anyone with the link", and paste the link here.
                </p>
                <Input
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  className="bg-white border-2 border-border focus:border-apollo text-neutral-900 shadow-sm h-11"
                />
                {lessonToEdit?.fileUrl && !externalUrl && (
                  <p className="text-sm text-amber-600 font-medium mt-2">
                    Warning: This lesson still uses a Convex-hosted file. Please migrate it to Google Drive to save data egress.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="hover:bg-surface-secondary hover:text-text-primary dark:hover:bg-surface-secondary dark:hover:text-text-primary dark:border-border dark:text-text-primary">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-apollo hover:bg-apollo-dark text-white">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lessonToEdit ? "Update Lesson" : "Create Lesson"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
