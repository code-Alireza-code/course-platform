import z from "zod/v3";

export const courseSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
});
