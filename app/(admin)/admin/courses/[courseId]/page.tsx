"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, GripVertical, Settings } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.courseId as any;
  const router = useRouter();

  const course = useQuery(api.courses.getCourse, { courseId });
  const chapters = useQuery(api.chapters.listChapters, { courseId });
  const createChapter = useMutation(api.chapters.createChapter);
  const deleteChapter = useMutation(api.chapters.deleteChapter);
  const reorderChapters = useMutation(api.chapters.reorderChapters);

  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!chapters || !over) return;

    if (active.id !== over.id) {
      const oldIndex = chapters.findIndex((c) => c._id === active.id);
      const newIndex = chapters.findIndex((c) => c._id === over.id);
      const newChapters = arrayMove(chapters, oldIndex, newIndex);
      
      const updates = newChapters.map((ch, index) => ({
        _id: ch._id,
        order: index,
      }));

      // Optimistic update could go here
      await reorderChapters({ updates });
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createChapter({
        courseId,
        title: newChapterTitle,
      });
      setNewChapterTitle("");
      setIsAddingChapter(false);
      toast.success("Chapter added");
    } catch (err) {
      toast.error("Failed to add chapter");
    }
  };

  const handleDeleteChapter = async () => {
    if (!chapterToDelete) return;
    try {
      await deleteChapter({ chapterId: chapterToDelete as any });
      setChapterToDelete(null);
      toast.success("Chapter deleted");
    } catch (err) {
      toast.error("Failed to delete chapter");
    }
  };

  if (!course || !chapters) {
    return <div className="p-8 max-w-4xl mx-auto space-y-8"><Skeleton className="h-[400px]" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/admin/courses"><ArrowLeft size={20} /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-outfit font-bold text-text-primary">{course.title}</h1>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${
              course.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
              {course.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <Button variant="outline" asChild className="border-apollo text-apollo hover:bg-apollo-muted">
          <Link href={`/admin/courses/${courseId}/edit`}><Settings className="mr-2 h-4 w-4"/> Settings</Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardContent className="p-0">
          <div className="p-6 border-b border-border flex justify-between items-center bg-surface-secondary rounded-t-2xl">
            <div>
              <h2 className="text-xl font-outfit font-bold text-text-primary">Chapters</h2>
              <p className="text-sm text-text-secondary mt-1">Drag and drop to reorder chapters</p>
            </div>
            <Button onClick={() => setIsAddingChapter(true)} className="bg-apollo hover:bg-apollo-dark text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Chapter
            </Button>
          </div>

          <div className="p-6">
            {chapters.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                No chapters yet. Click "Add Chapter" to get started.
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={chapters.map(c => c._id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {chapters.sort((a, b) => a.order - b.order).map((chapter, index) => (
                      <SortableChapterItem
                        key={chapter._id}
                        chapter={chapter}
                        index={index}
                        onDelete={() => setChapterToDelete(chapter._id)}
                        courseId={courseId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Chapter Dialog */}
      <Dialog open={isAddingChapter} onOpenChange={setIsAddingChapter}>
        <DialogContent>
          <form onSubmit={handleCreateChapter}>
            <DialogHeader>
              <DialogTitle>Add New Chapter</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="title" className="mb-2 block">Chapter Title</Label>
              <Input
                id="title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                placeholder="e.g., Chapter 1: The Basics"
                required
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingChapter(false)}>Cancel</Button>
              <Button type="submit" className="bg-apollo text-white hover:bg-apollo-dark">Create Chapter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Chapter Dialog */}
      <Dialog open={!!chapterToDelete} onOpenChange={(open) => !open && setChapterToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chapter?</DialogTitle>
            <DialogDescription>
              This will permanently delete this chapter and all its lessons.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChapterToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteChapter}>Delete Chapter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableChapterItem({ chapter, index, onDelete, courseId }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-white border border-border p-4 rounded-xl shadow-sm group">
      <button {...attributes} {...listeners} className="cursor-grab text-text-muted hover:text-text-primary focus:outline-none">
        <GripVertical size={20} />
      </button>
      <div className="flex-1">
        <p className="font-semibold text-text-primary">
          <span className="text-text-muted font-normal mr-2">Chapter {index + 1}:</span>
          {chapter.title}
        </p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-apollo hover:text-apollo-dark hover:bg-apollo-muted">
          <Link href={`/admin/courses/${courseId}/chapters/${chapter._id}`}>
            <Edit size={16} />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
