import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { CourseSectionTable } from "./courseSection";
import { relations } from "drizzle-orm";

export const lessonsStatuses = ["public", "private", "preview"] as const;
export type LessonsStatus = (typeof lessonsStatuses)[number];
export const lessonsStatusesEnum = pgEnum("lesson_status", lessonsStatuses);

export const LessonTable = pgTable("lessons", {
  id,
  name: text().notNull(),
  description: text(),
  youtubeVideoId: text().notNull(),
  order: integer().notNull(),
  status: lessonsStatusesEnum().notNull().default("private"),
  sectionId: uuid()
    .notNull()
    .references(() => CourseSectionTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const LessonRelationships = relations(LessonTable, ({ one }) => ({
  section: one(CourseSectionTable, {
    fields: [LessonTable.sectionId],
    references: [CourseSectionTable.id],
  }),
}));
