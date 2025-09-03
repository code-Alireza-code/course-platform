import { courseSectionStatuses } from "@/drizzle/schema";
import z from "zod/v3";

export const sectionSchema = z.object({
  name: z.string().min(1, "required"),
  status: z.enum(courseSectionStatuses),
});
