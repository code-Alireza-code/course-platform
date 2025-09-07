"use client";

import SortableList, { SortableItem } from "@/components/SortableList";
import { LessonsStatus } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { EyeClosed, Trash2, Video } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ActionButton from "@/components/ActionButton";
import LessonFormDialog from "./LessonFormDialog";
import { deleteLesson, updateLessonOrders } from "../actions/lesson";

function SortableLessonList({
  sections,
  lessons,
}: {
  sections: {
    id: string;
    name: string;
  }[];
  lessons: {
    id: string;
    name: string;
    status: LessonsStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  }[];
}) {
  return (
    <SortableList items={lessons} onOrderChange={updateLessonOrders}>
      {(items) =>
        items.map((lesson) => (
          <SortableItem
            key={lesson.id}
            id={lesson.id}
            className="flex items-center gap-1"
          >
            <div
              className={cn(
                "contents",
                lesson.status === "private" && "text-muted-foreground"
              )}
            >
              {lesson.status === "private" && <EyeClosed className="size-4" />}
              {lesson.status === "preview" && <Video className="size-4" />}
              {lesson.name}
            </div>
            <LessonFormDialog sections={sections} lesson={lesson}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Edit
                </Button>
              </DialogTrigger>
            </LessonFormDialog>
            <ActionButton
              action={deleteLesson.bind(null, lesson.id)}
              requiredAreyouSure
              variant="destructiveOutline"
              size="sm"
            >
              <Trash2 />
              <span className="sr-only">Delete</span>
            </ActionButton>
          </SortableItem>
        ))
      }
    </SortableList>
  );
}

export default SortableLessonList;
