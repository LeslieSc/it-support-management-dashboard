import {
  z,
} from "zod";

export const registerSchema =
  z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Full name must contain at least 2 characters."
      )
      .max(
        120,
        "Full name cannot exceed 120 characters."
      ),

    email: z
      .string()
      .trim()
      .email(
        "Invalid email address."
      )
      .max(
        150,
        "Email cannot exceed 150 characters."
      ),

    password: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters."
      )
      .max(
        72,
        "Password cannot exceed 72 characters."
      ),
  });

export const loginSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email(
        "Invalid email address."
      ),

    password: z
      .string()
      .min(
        1,
        "Password is required."
      ),
  });