"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Edit, Trash2, GripVertical, FileVideo, FileText, FileBarChart, Type } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LessonForm } from "@/components/admin/LessonForm";

const LESSON_ICONS = {
  video: <FileVideo size={16} className="text-red-600" />,
  pdf: <FileText size={16} className="text-orange-600" />,
  ppt: <FileBarChart size={16} className="text-blue-600" />,
  text: <Type size={16} className="text-green-600" />,
};

const LESSON_BADGES = {
  video: "bg-red-50 text-red-700 border border-red-200",
  pdf: "bg-orange-50 text-orange-700 border border-orange-200",
  ppt: "bg-blue-50 text-blue-700 border border-blue-200",
  text: "bg-green-50 text-green-700 border border-green-200",
};

export default function ChapterDetailsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const chapterId = params.chapterId as string;

  const chapter = useQuery(api.chapters.getChapter, { chapterId: chapterId as any });
  const lessons = useQuery(api.lessons.listLessons, { chapterId: chapterId as any });
  
  const deleteLesson = useMutation(api.lessons.deleteLesson);
  const reorderLessons = useMutation(api.lessons.reorderLessons);

  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [lessonToEdit, setLessonToEdit] = useState<any | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!lessons || !over) return;

    if (active.id !== over.id) {
      const oldIndex = lessons.findIndex((l) => l._id === active.id);
      const newIndex = lessons.findIndex((l) => l._id === over.id);
      const newLessons = arrayMove(lessons, oldIndex, newIndex);
      
      const updates = newLessons.map((l, index) => ({
        _id: l._id,
        order: index,
      }));

      await reorderLessons({ updates });
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;
    try {
      await deleteLesson({ lessonId: lessonToDelete as any });
      setLessonToDelete(null);
      toast.success("Lesson deleted");
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  };

  if (!chapter || !lessons) {
    return <div className="p-8 max-w-4xl mx-auto"><Skeleton className="h-[400px]" /></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href={`/admin/courses/${courseId}`}><ArrowLeft size={20} /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-outfit font-bold text-text-primary">{chapter.title}</h1>
          <p className="text-text-secondary mt-1">Manage lessons for this chapter</p>
        </div>
      </div>

      {!isAddingLesson && !lessonToEdit ? (
        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface-secondary rounded-t-2xl">
              <div>
                <h2 className="text-xl font-outfit font-bold text-text-primary">Lessons</h2>
              </div>
              <Button onClick={() => setIsAddingLesson(true)} className="bg-apollo hover:bg-apollo-dark text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Lesson
              </Button>
            </div>

            <div className="p-6">
              {lessons.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  No lessons yet. Click "Add Lesson" to get started.
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={lessons.map(l => l._id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {lessons.sort((a, b) => a.order - b.order).map((lesson, index) => (
                        <SortableLessonItem
                          key={lesson._id}
                          lesson={lesson}
                          onDelete={() => setLessonToDelete(lesson._id)}
                          onEdit={() => setLessonToEdit(lesson)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <LessonForm 
          courseId={courseId}
          chapterId={chapterId}
          lessonToEdit={lessonToEdit}
          onClose={() => {
            setIsAddingLesson(false);
            setLessonToEdit(null);
          }}
        />
      )}

      {/* Delete Lesson Dialog */}
      <Dialog open={!!lessonToDelete} onOpenChange={(open) => !open && setLessonToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lesson?</DialogTitle>
            <DialogDescription>
              This will permanently delete this lesson.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLesson}>Delete Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableLessonItem({ lesson, onDelete, onEdit }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-white border border-border p-4 rounded-xl shadow-sm group">
      <button {...attributes} {...listeners} className="cursor-grab text-text-muted hover:text-text-primary focus:outline-none">
        <GripVertical size={20} />
      </button>
      <div className="flex-1 flex items-center gap-3">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-20 justify-center ${LESSON_BADGES[lesson.type as keyof typeof LESSON_BADGES]}`}>
          {LESSON_ICONS[lesson.type as keyof typeof LESSON_ICONS]}
          {lesson.type}
        </span>
        <p className="font-semibold text-text-primary">
          {lesson.title}
        </p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-apollo hover:text-apollo-dark hover:bg-apollo-muted">
          <Edit size={16} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
