import { lessonsStatusesEnum } from "@/drizzle/schema";
import { z } from "zod/v3";

export const lessonSchema = z.object({
  name: z.string().min(1, "Required"),
  sectionId: z.string().min(1, "Required"),
  status: z.enum(lessonsStatusesEnum.enumValues),
  youtubeVideoId: z.string().min(1, "Required"),
  description: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});
