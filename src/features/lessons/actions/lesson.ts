"use server";

import z from "zod/v3";
import { lessonSchema } from "../schemas/lessons";
import { getCurrentUser } from "@/services/clerk";
import {
  canCreateLessons,
  canDeleteLessons,
  canUpdateLessons,
} from "../permissions/lessons";
import { getNextCoureseLessonOrder } from "../db/lessons";
import {
  insertLesson,
  updateLesson as updateLessonDb,
  deleteLesson as deleteLessonDb,
  updateLessonOrders as updateLessonOrdersDb,
} from "../db/lessons";

export async function createLesson(unsafeData: z.infer<typeof lessonSchema>) {
  const { success, data } = lessonSchema.safeParse(unsafeData);

  if (!success || !canCreateLessons(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error creating your lesson !",
    };
  }

  const order = await getNextCoureseLessonOrder(data.sectionId);

  await insertLesson({ ...data, order });

  return {
    error: false,
    message: "successfully created your lesson",
  };
}

export async function updateLesson(
  id: string,
  unsafeData: z.infer<typeof lessonSchema>
) {
  const { success, data } = lessonSchema.safeParse(unsafeData);

  if (!success || !canUpdateLessons(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error updating your lesson !",
    };
  }

  await updateLessonDb(id, data);

  return {
    error: false,
    message: "successfully updated your lesson !",
  };
}

export async function deleteLesson(id: string) {
  if (!canDeleteLessons(await getCurrentUser())) {
    return {
      error: true,
      message: "Error Deleting your lesson !",
    };
  }

  await deleteLessonDb(id);

  return {
    error: false,
    message: "successfully deleted your lesson !",
  };
}

export async function updateLessonOrders(lessonIds: string[]) {
  if (lessonIds.length === 0 || !canUpdateLessons(await getCurrentUser())) {
    return {
      error: true,
      message: "Error reordering your lessons !",
    };
  }

  await updateLessonOrdersDb(lessonIds);

  return {
    error: false,
    message: "successfully reordered your lessons !",
  };
}
