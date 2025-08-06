import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().optional().nullable(),
  completed: z.boolean().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
});
