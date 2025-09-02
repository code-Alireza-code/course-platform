import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { revalidateCourseCache } from "./cache";
import { eq } from "drizzle-orm";

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
  const [newCourse] = await db.insert(CourseTable).values(data).returning();

  if (newCourse == null) throw new Error("failed to create course !");

  revalidateCourseCache(newCourse.id);

  return newCourse;
}

export async function deleteCourse(id: string) {
  const [deletedCourse] = await db
    .delete(CourseTable)
    .where(eq(CourseTable.id, id))
    .returning();

  if (deletedCourse == null) throw new Error("failed to delete course !");
  revalidateCourseCache(deletedCourse.id);

  return deletedCourse;
}
