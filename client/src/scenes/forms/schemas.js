import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email(),
  newUsername: z.string().min(3).max(20),
  newPassword: z.string().optional(),
  confirmedNewPassword: z.string().optional(),
});

export const transactionSchema = z.object({
  amount: z.coerce.number().positive(),
  categoryID: z.string().min(1),
});

export const goalSchema = z.object({
  goal: z.string().min(1).max(100),
  deadline: z.string().date().min(new Date().toISOString().split("T")[0]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(8),
});

export const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  passwordHash: z.string().min(8),
});
