import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters")
    .optional()
    .or(z.literal("")),

  position: z
    .string()
    .trim()
    .min(2, "Position must be at least 2 characters"),

  department: z
    .string()
    .trim()
    .min(2, "Department must be at least 2 characters"),

  salary: z.coerce
    .number()
    .nonnegative("Salary cannot be negative")
    .optional(),

  hireDate: z.coerce.date({
    error: "Please provide a valid hire date",
  }),

  status: z
    .enum(["ACTIVE", "INACTIVE", "ON_LEAVE"])
    .optional(),
});