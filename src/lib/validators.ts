import { z } from "zod"

// Question validation schema
export const questionSchema = z.object({
  text: z.string().min(10, "Question must be at least 10 characters"),
  explanation: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  category: z.string().min(1, "Category is required"),
  points: z.number().int().positive().default(1),
  testId: z.string().min(1, "Test is required"),
  answers: z.array(
    z.object({
      text: z.string().min(1, "Answer text is required"),
      isCorrect: z.boolean()
    })
  ).min(2, "At least 2 answers are required")
    .refine(
      (answers) => answers.filter((a) => a.isCorrect).length >= 1,
      "At least one answer must be correct"
    )
})

// Test validation schema
export const testSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  duration: z.number().int().positive().min(1, "Duration must be at least 1 minute"),
  totalQuestions: z.number().int().positive().min(1, "Must have at least 1 question"),
  passingScore: z.number().min(0).max(100, "Passing score must be between 0 and 100"),
  shuffleQuestions: z.boolean().default(true),
  shuffleAnswers: z.boolean().default(true)
})

// User validation schema
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "TEST_TAKER"]).default("TEST_TAKER")
})

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

// Export types
export type QuestionInput = z.infer<typeof questionSchema>
export type TestInput = z.infer<typeof testSchema>
export type UserInput = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
